import test from "node:test";
import assert from "node:assert/strict";
import {demoReplay} from "../src/replay.mjs";
import {springStep,simulateHemAt} from "../src/physics.mjs";
test("spring stays stable and reproducible",()=>{
  const replay=demoReplay();
  for(const ms of [0,100,500,1500,3500,7999]){
    const a=simulateHemAt(replay,ms);
    const b=simulateHemAt(replay,ms);
    assert.equal(a,b);
    assert.ok(Math.abs(a)<.25);
  }
});
test("spring rejects unsafe parameter configurations",()=>{
  assert.throws(()=>springStep({x:0,v:0},1,0.02,{damping:-1}));
  assert.throws(()=>springStep({x:0,v:0},1,1,{frequency:2}));
  assert.throws(()=>simulateHemAt(demoReplay(),NaN));
});
