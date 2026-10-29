/**
 * Synthetic only. Produces comparable diagnostic observations on the same
 * replay clock, canonical pose, garment resolution and physics settings.
 * Does NOT prove real Cubism or artist acceptance; no automatic rigging claim.
 */
import {bodyPose,garmentMesh} from './garment.mjs';
import {simulateHemAt} from './physics.mjs';
import {demoReplay,sampleReplay,validateReplay} from './replay.mjs';
import {inspectGarmentSequence,evaluateQualityGates} from './garment-quality.mjs';

const MAX_BENCH_DURATION = 15_000; // fixed-step hem simulator reruns from t=0 each sample
export function buildSyntheticGarmentReport({
  replay=demoReplay(), intervalMs=200, columns=6, rows=6,
  physics={}, gates=null,
}={}) {
  const timeline=validateReplay(replay);
  if(timeline.durationMs>MAX_BENCH_DURATION) {
    throw new RangeError('Synthetic benchmark limited to <=15 s (bounded CPU)');
  }
  if(!Number.isInteger(intervalMs)||intervalMs<20||intervalMs>2000 ||
    !Number.isInteger(columns)||columns<1||columns>24||
    !Number.isInteger(rows)||rows<1||rows>24 ||
    !physics || typeof physics!=='object' || Array.isArray(physics)) {
    throw new RangeError('Invalid synthetic benchmark sampling or mesh configuration');
  }
  const neutralPose=bodyPose({ParamAngleX:0,ParamBreath:.5});
  const reference=garmentMesh(neutralPose,{columns,rows,hemSwing:0});
  const times=[];
  for(let t=0;t<timeline.durationMs;t+=intervalMs)times.push(t);
  times.push(timeline.durationMs);
  const frames=times.map(timeMs=>{
    const pose=bodyPose(sampleReplay(timeline,timeMs));
    const hemSwing=simulateHemAt(timeline,timeMs,physics);
    return {timeMs,pose,mesh:garmentMesh(pose,{columns,rows,hemSwing})};
  });
  const metrics=inspectGarmentSequence(frames,reference);
  return {
    schema:'vtube-garment-quality-synthetic-v1',
    source:'generated_demo_or_explicit_replay_no_real_model',
    provenance:'geometry_only_not_live2d_or_visual_acceptance',
    parameters:{durationMs:timeline.durationMs,intervalMs,columns,rows,
      physics:{...physics}},
    metrics,
    qualityGates:gates===null?null:evaluateQualityGates(metrics,gates),
  };
}
