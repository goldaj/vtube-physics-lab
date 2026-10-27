/**
 * Measurable, pure geometry diagnostics for a 2D garment transferred onto a body.
 * Research instrument only: zero knowledge of art meshes, occlusion or Cubism.
 * Coordinates are normalized canvas units, NOT pixels or material-space strain.
 * Metrics are observations, not evidence that a garment looks good on a person.
 */
const EPS = 1e-12;
const GATES = new Set([
  'maxEdgeStretch', 'minEdgeStretch', 'minAreaRatio', 'maxAreaRatio',
  'maxAnchorSlip', 'maxVertexSpeedPerSec', 'invertedTriangles', 'collapsedTriangles',
]);

const finite = x => typeof x === 'number' && Number.isFinite(x);
function requireNumber(v, label) {
  if (!finite(v)) throw new RangeError(`${label} must be finite`);
  return v;
}
function requirePoint(p, label) {
  if (!p || typeof p !== 'object') throw new TypeError(`${label} missing point`);
  for (const axis of ['x', 'y', 'u', 'v']) requireNumber(p[axis], `${label}.${axis}`);
  if (p.u < 0 || p.u > 1 || p.v < 0 || p.v > 1) {
    throw new RangeError(`${label} UV must be in [0,1]`);
  }
}
function validateMesh(mesh, label) {
  if (!mesh || typeof mesh !== 'object' || !Number.isInteger(mesh.columns) ||
      !Number.isInteger(mesh.rows) || mesh.columns < 1 || mesh.rows < 1 ||
      mesh.columns > 128 || mesh.rows > 128 ||
      !Array.isArray(mesh.points) || mesh.points.length !== mesh.rows + 1) {
    throw new RangeError(`${label} invalid rectangular mesh`);
  }
  for (let j=0; j<=mesh.rows; j++) {
    const row=mesh.points[j];
    if (!Array.isArray(row) || row.length !== mesh.columns+1) {
      throw new RangeError(`${label} jagged mesh`);
    }
    for (let i=0; i<=mesh.columns; i++) {
      requirePoint(row[i], `${label}[${j},${i}]`);
    }
  }
}
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const twiceArea=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function triangles(mesh) {
  const all=[];
  for (let j=0; j<mesh.rows; j++) for (let i=0; i<mesh.columns; i++) {
    const a=mesh.points[j][i], b=mesh.points[j][i+1],
      c=mesh.points[j+1][i+1], d=mesh.points[j+1][i];
    all.push([a,b,d], [b,c,d]);
  }
  return all;
}
function sameUV(mesh, reference) {
  if (mesh.columns!==reference.columns || mesh.rows!==reference.rows) {
    throw new RangeError('Meshes have different resolution');
  }
  for (let j=0;j<=mesh.rows;j++) for (let i=0;i<=mesh.columns;i++) {
    const a=mesh.points[j][i], b=reference.points[j][i];
    if (Math.abs(a.u-b.u)>EPS || Math.abs(a.v-b.v)>EPS) {
      throw new RangeError('Meshes do not share identical UV topology');
    }
  }
}
function expectedAnchors(pose) {
  if (pose == null) return null;
  if (typeof pose!=='object' || !pose.shoulderLeft || !pose.shoulderRight) {
    throw new TypeError('Pose must have both shoulder landmarks');
  }
  for (const [name,p] of Object.entries({left:pose.shoulderLeft,right:pose.shoulderRight})) {
    if (!p || !finite(p.x) || !finite(p.y)) throw new RangeError(`Invalid ${name} anchor`);
  }
  return [pose.shoulderLeft,pose.shoulderRight];
}

/**
 * Topology metrics for ONE mesh relative to a known, independent rest mesh.
 * A flip is defined by a signed area sign change against matching UV triangle.
 * A collapsed triangle has |current signed area| <= EPS; one can be collapsed
 * without being inverted. Do not sum these disjointly as "bad triangles".
 */
export function inspectGarmentFrame(mesh, reference, {pose=null}={}) {
  validateMesh(mesh,'garment');
  validateMesh(reference,'reference');
  sameUV(mesh,reference);
  const ts=triangles(mesh), rs=triangles(reference);
  let inverted=0,collapsed=0,maxEdgeStretch=0,minEdgeStretch=Infinity;
  let maxAreaRatio=0,minAreaRatio=Infinity;
  for(let k=0;k<ts.length;k++) {
    const a=ts[k],b=rs[k];
    const referenceArea=twiceArea(...b), currentArea=twiceArea(...a);
    if (!finite(referenceArea) || Math.abs(referenceArea)<=EPS) {
      throw new RangeError('Reference contains degenerate triangle');
    }
    if(!finite(currentArea))throw new RangeError('Non-finite deformed triangle area');
    const ratio=Math.abs(currentArea/referenceArea);
    if(Math.abs(currentArea)<=EPS)collapsed++;
    else if(Math.sign(currentArea)!==Math.sign(referenceArea))inverted++;
    minAreaRatio=Math.min(minAreaRatio,ratio); maxAreaRatio=Math.max(maxAreaRatio,ratio);
    for(const [i,j] of [[0,1],[1,2],[2,0]]) {
      const r=length(b[i],b[j]), c=length(a[i],a[j]);
      if(!finite(r) || r<=EPS)throw new RangeError('Reference contains degenerate edge');
      const stretch=c/r;
      if(!finite(stretch))throw new RangeError('Invalid edge stretch');
      minEdgeStretch=Math.min(minEdgeStretch,stretch);
      maxEdgeStretch=Math.max(maxEdgeStretch,stretch);
    }
  }
  const anchors=expectedAnchors(pose);
  const slip=anchors===null?null:Math.max(
    length(mesh.points[0][0],anchors[0]),
    length(mesh.points[0][mesh.columns],anchors[1]),
  );
  return {
    triangleCount:ts.length, invertedTriangles:inverted, collapsedTriangles:collapsed,
    minAreaRatio, maxAreaRatio, minEdgeStretch, maxEdgeStretch,
    maxAnchorSlip:slip,
  };
}

/**
 * Ordered frames: [{timeMs,mesh,pose?}]. Time is absolute and unique.
 * Speed is vertex displacement / elapsed seconds, including intended body motion.
 * It is NOT a measure of jerk, smoothness or FPS by itself.
 */
export function inspectGarmentSequence(frames, reference) {
  if(!Array.isArray(frames) || frames.length===0 || frames.length>10000) {
    throw new RangeError('Provide 1..10000 frames');
  }
  validateMesh(reference,'reference');
  let previous=null, worstSpeed=0;
  const samples=[];
  for(const f of frames) {
    if(!f || !finite(f.timeMs) || f.timeMs<0 ||
       (previous && f.timeMs<=previous.timeMs)) {
      throw new RangeError('Frames must have distinct increasing nonnegative times');
    }
    const metrics=inspectGarmentFrame(f.mesh,reference,{pose:f.pose??null});
    let speed=null;
    if(previous) {
      const seconds=(f.timeMs-previous.timeMs)/1000;
      speed=0;
      for(let j=0;j<=reference.rows;j++)for(let i=0;i<=reference.columns;i++) {
        speed=Math.max(speed,length(f.mesh.points[j][i],previous.mesh.points[j][i])/seconds);
      }
      worstSpeed=Math.max(worstSpeed,speed);
    }
    samples.push({timeMs:f.timeMs,...metrics,maxVertexSpeedPerSec:speed});
    previous=f;
  }
  return {
    provenance:'synthetic_geometry_diagnostics_not_live2d_validation',
    sampleCount:samples.length, triangleCount:samples[0].triangleCount,
    invertedTriangles:Math.max(...samples.map(s=>s.invertedTriangles)),
    collapsedTriangles:Math.max(...samples.map(s=>s.collapsedTriangles)),
    minAreaRatio:Math.min(...samples.map(s=>s.minAreaRatio)),
    maxAreaRatio:Math.max(...samples.map(s=>s.maxAreaRatio)),
    minEdgeStretch:Math.min(...samples.map(s=>s.minEdgeStretch)),
    maxEdgeStretch:Math.max(...samples.map(s=>s.maxEdgeStretch)),
    maxAnchorSlip:samples.some(s=>s.maxAnchorSlip===null)?null:
      Math.max(...samples.map(s=>s.maxAnchorSlip)),
    maxVertexSpeedPerSec:frames.length===1?null:worstSpeed,
    samples,
  };
}

/** Explicitly opt-in, hypothesis thresholds. Never claim perceptual quality. */
export function evaluateQualityGates(report, gates) {
  if(!report || typeof report!=='object' || !gates || typeof gates!=='object' ||
    Array.isArray(gates) || !Object.keys(gates).length) {
    throw new TypeError('Metrics and explicit nonempty gates required');
  }
  const failures=[];
  for(const [key,threshold] of Object.entries(gates)) {
    if(!GATES.has(key) || !finite(threshold) || threshold<0) {
      throw new RangeError(`Invalid gate ${key}`);
    }
    if(!finite(report[key]))throw new RangeError(`Unavailable metric ${key}`);
    const violated=key.startsWith('min') ? report[key]<threshold : report[key]>threshold;
    if(violated)failures.push({metric:key,observed:report[key],threshold});
  }
  return {passed:failures.length===0,failures,gates:{...gates},
    interpretation:'threshold_checks_on_synthetic_mesh_only'};
}
