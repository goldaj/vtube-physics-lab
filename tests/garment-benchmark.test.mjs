import test from 'node:test';
import assert from 'node:assert/strict';
import {demoReplay} from '../src/replay.mjs';
import {buildSyntheticGarmentReport} from '../src/garment-benchmark.mjs';

const simple=()=>buildSyntheticGarmentReport({intervalMs:200,columns:3,rows:3});
test('synthetic replay with real mesh/spring is deterministic on absolute times',()=>{
  const a=simple(), b=simple();
  assert.deepEqual(a,b);
  assert.equal(a.schema,'vtube-garment-quality-synthetic-v1');
  assert.equal(a.metrics.sampleCount,41);
  assert.equal(a.metrics.triangleCount,18);
  assert.equal(a.metrics.samples.at(-1).timeMs,8000);
  assert.ok(a.metrics.maxEdgeStretch>0);
  assert.ok(a.metrics.maxAreaRatio>0);
  assert.equal(a.qualityGates,null);
});
test('common endpoints are identical regardless of replay sampling cadence',()=>{
  const a=buildSyntheticGarmentReport({intervalMs:200,columns:3,rows:3});
  const b=buildSyntheticGarmentReport({intervalMs:500,columns:3,rows:3});
  for(const timeMs of [0,1000,2000,3000,4000,5000,6000,7000,8000]){
    const x=a.metrics.samples.find(s=>s.timeMs===timeMs);
    const y=b.metrics.samples.find(s=>s.timeMs===timeMs);
    assert.deepEqual({...x,maxVertexSpeedPerSec:null},{...y,maxVertexSpeedPerSec:null});
  }
});
test('invalid and unbounded variants fail closed',()=>{
  assert.throws(()=>buildSyntheticGarmentReport({intervalMs:0}),/Invalid/);
  assert.throws(()=>buildSyntheticGarmentReport({columns:0}),/Invalid/);
  assert.throws(()=>buildSyntheticGarmentReport({replay:{...demoReplay(),durationMs:20000}}),/15 s/);
});
