import test from "node:test";
import assert from "node:assert/strict";
import {demoReplay,validateReplay,sampleReplay,decodeReplay,encodeReplay,TYPE} from "../src/replay.mjs";
const demo=demoReplay();
test("canonical versioned replay roundtrips and interpolates",()=>{
  const serial=encodeReplay(demo);
  assert.deepEqual(decodeReplay(serial),demo);
  assert.equal(demo.type,TYPE);
  assert.equal(sampleReplay(demo,0).ParamAngleX,0);
  assert.ok(Math.abs(sampleReplay(demo,750).ParamAngleX-11)<1e-9);
  assert.equal(sampleReplay(demo,9000).ParamAngleX,0);
});
test("refuses unsorted, duplicate, nonfinite and out of range values",()=>{
  const bad=(keys)=>({...demo,channels:[{...demo.channels[0],keys}]});
  assert.throws(()=>validateReplay(bad([{t:50,v:1},{t:50,v:2}])));
  assert.throws(()=>validateReplay(bad([{t:100,v:1},{t:0,v:2}])));
  assert.throws(()=>validateReplay(bad([{t:0,v:NaN}])));
  assert.throws(()=>validateReplay(bad([{t:0,v:99}])));
  assert.throws(()=>validateReplay({...demo,version:2}));
  assert.throws(()=>validateReplay({...demo,channels:[demo.channels[0],demo.channels[0]]}));
  assert.throws(()=>decodeReplay(" ".repeat(513_000)));
  assert.throws(()=>sampleReplay(demo,Infinity));
});
test("holds default until first keyframe",()=>{
  const replay=validateReplay({...demo,channels:[{...demo.channels[0],
    keys:[{t:200,v:10},{t:400,v:20}]}]});
  assert.equal(sampleReplay(replay,100).ParamAngleX,0);
  assert.equal(sampleReplay(replay,300).ParamAngleX,15);
  assert.equal(sampleReplay(replay,1000).ParamAngleX,20);
});
