import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectGarmentFrame,inspectGarmentSequence,evaluateQualityGates} from '../src/garment-quality.mjs';

const pt=(x,y,u=x,v=y)=>({x,y,u,v});
function mesh(x=1,y=1) {return {columns:1,rows:1,points:[
  [pt(0,0,0,0),pt(x,0,1,0)],
  [pt(0,y,0,1),pt(x,y,1,1)],
]};}
const rest=mesh();
const anchors={shoulderLeft:{x:0,y:0},shoulderRight:{x:1,y:0}};

test('identity mesh measures no distortion and zero shoulder slip',()=>{
  const m=inspectGarmentFrame(rest,rest,{pose:anchors});
  assert.equal(m.triangleCount,2);
  assert.equal(m.invertedTriangles,0);
  assert.equal(m.collapsedTriangles,0);
  assert.equal(m.minAreaRatio,1);
  assert.equal(m.maxAreaRatio,1);
  assert.equal(m.maxEdgeStretch,1);
  assert.equal(m.minEdgeStretch,1);
  assert.equal(m.maxAnchorSlip,0);
});
test('uniform doubling scales edges by 2 and area by 4',()=>{
  const m=inspectGarmentFrame(mesh(2,2),rest);
  assert.equal(m.maxEdgeStretch,2);
  assert.equal(m.minEdgeStretch,2);
  assert.equal(m.minAreaRatio,4);
  assert.equal(m.maxAreaRatio,4);
});
test('reversing a triangle catches inversion without a false collapse',()=>{
  const current=mesh();
  current.points[1][0]={...current.points[1][0],x:.2,y:-1};
  const m=inspectGarmentFrame(current,rest);
  assert.ok(m.invertedTriangles>=1);
  assert.equal(m.collapsedTriangles,0);
});
test('zero-height mesh is collapsed, not inverted',()=>{
  const m=inspectGarmentFrame(mesh(1,0),rest);
  assert.equal(m.collapsedTriangles,2);
  assert.equal(m.invertedTriangles,0);
  assert.equal(m.minAreaRatio,0);
});
test('shoulder slip detects bad attachments in canvas-relative units',()=>{
  const shifted=mesh(); shifted.points[0][0].x=.04;
  assert.ok(Math.abs(inspectGarmentFrame(shifted,rest,{pose:anchors}).maxAnchorSlip-.04)<1e-10);
});
test('mismatched UV topology, degenerate references, NaN and jagged inputs fail closed',()=>{
  const different=mesh();different.points[1][1].u=.7;
  assert.throws(()=>inspectGarmentFrame(different,rest),/UV topology/);
  assert.throws(()=>inspectGarmentFrame(rest,mesh(1,0)),/degenerate/);
  const broken=mesh();broken.points[1][1].x=NaN;
  assert.throws(()=>inspectGarmentFrame(broken,rest),/finite/);
  assert.throws(()=>inspectGarmentFrame({columns:2,rows:1,points:[]},rest),/rectangular/);
});
test('sequence is reproducible with fixed inputs and reports measured speed',()=>{
  const frames=[
    {timeMs:0,mesh:rest,pose:anchors},
    {timeMs:200,mesh:mesh(1.1,1),pose:anchors},
    {timeMs:500,mesh:mesh(1,1),pose:anchors},
  ];
  const first=inspectGarmentSequence(frames,rest);
  const second=inspectGarmentSequence(frames,rest);
  assert.deepEqual(first,second);
  assert.equal(first.provenance,'synthetic_geometry_diagnostics_not_live2d_validation');
  assert.ok(Math.abs(first.maxVertexSpeedPerSec-.5)<1e-10);
  assert.equal(first.sampleCount,3);
  assert.ok(Math.abs(first.maxAnchorSlip-.1)<1e-10);
});
test('frames reject duplicates, reverse time and lack of samples',()=>{
  assert.throws(()=>inspectGarmentSequence([],rest),/Provide/);
  assert.throws(()=>inspectGarmentSequence([
    {timeMs:1,mesh:rest},{timeMs:1,mesh:rest}],rest),/distinct/);
  assert.throws(()=>inspectGarmentSequence([{timeMs:-1,mesh:rest}],rest),/nonnegative/);
});
test('explicit quality gates keep raw metrics and never infer perceptual approval',()=>{
  const r=inspectGarmentFrame(mesh(2,2),rest);
  const g=evaluateQualityGates(r,{maxEdgeStretch:1.8,minAreaRatio:.5,maxAreaRatio:3});
  assert.equal(g.passed,false);
  assert.equal(g.failures.length,2);
  assert.equal(g.failures[0].metric,'maxEdgeStretch');
  assert.deepEqual(evaluateQualityGates(r,{maxEdgeStretch:2,maxAreaRatio:4}).failures,[]);
  assert.throws(()=>evaluateQualityGates(r,{madeUp:1}),/Invalid/);
  assert.throws(()=>evaluateQualityGates(r,{maxAnchorSlip:1}),/Unavailable/);
});
test('single frame provides explicit unavailable speed, cannot game speed gate',()=>{
  const r=inspectGarmentSequence([{timeMs:0,mesh:rest}],rest);
  assert.equal(r.maxVertexSpeedPerSec,null);
  assert.throws(()=>evaluateQualityGates(r,{maxVertexSpeedPerSec:2}),/Unavailable/);
});
