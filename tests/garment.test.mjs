import test from "node:test";
import assert from "node:assert/strict";
import {bodyPose,garmentMesh,affineTriangle,paintWarpedGarment} from "../src/garment.mjs";
test("garment attaches to body landmarks at zero and nonzero angles",()=>{
  for(const angle of [-30,0,30]){
    const pose=bodyPose({ParamAngleX:angle,ParamBreath:.5});
    const mesh=garmentMesh(pose,{columns:2,rows:2,hemSwing:.08});
    assert.deepEqual({x:mesh.points[0][0].x,y:mesh.points[0][0].y},
      pose.shoulderLeft);
    assert.ok(Math.abs(mesh.points[2][0].x-pose.waistLeft.x-.08)<1e-10);
    assert.equal(mesh.points.length,3);
  }
});
test("affine mapping identity and translations",()=>{
  const src=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];
  const dst=[{x:10,y:20},{x:11,y:20},{x:10,y:21}];
  const m=affineTriangle(src,dst);
  assert.ok(Math.abs(m.a-1)<1e-10);
  assert.ok(Math.abs(m.d-1)<1e-10);
  assert.ok(Math.abs(m.e-10)<1e-10);
  assert.ok(Math.abs(m.f-20)<1e-10);
  assert.throws(()=>affineTriangle([src[0],src[0],src[0]],dst));
});
test("renderer clips every triangle and restores context state",()=>{
  let saves=0,restores=0,draws=0;
  const ctx={save(){saves++},restore(){restores++},beginPath(){},
    moveTo(){},lineTo(){},closePath(){},clip(){},setTransform(){},drawImage(){draws++}};
  const mesh=garmentMesh(bodyPose({}),{columns:2,rows:2});
  paintWarpedGarment(ctx,{width:64,height:64},mesh,400,400);
  assert.equal(draws,8);
  assert.equal(saves,restores);
});
