import {demoReplay,encodeReplay,decodeReplay,sampleReplay} from "../src/replay.mjs";
import {springStep,simulateHemAt} from "../src/physics.mjs";
import {bodyPose,garmentMesh,paintWarpedGarment} from "../src/garment.mjs";

const $=s=>document.querySelector(s);
const stage=$("#stage"),ctx=stage.getContext("2d");
const fabric=$("#fabric"),brushCtx=fabric.getContext("2d");
const mode=$("#mode"),timeInput=$("#time"),angleInput=$("#angle"),breathInput=$("#breath");
const frequency=$("#frequency"),damping=$("#damping"),outfit=$("#outfit");
let replay=demoReplay(),clock=0,playing=true,lastTime=performance.now(),manualSpring={x:0,v:0};
let drawing=false,lastBrushPos=null,loadToken=0;
const closets=new Map();
function status(message){$("#status").textContent=message;}
function paintBase(variant){
  brushCtx.clearRect(0,0,256,256);
  brushCtx.fillStyle=variant==="red"?"#a84c50":"#4278ba";
  brushCtx.strokeStyle=variant==="red"?"#f4ca86":"#cde3ff";
  brushCtx.lineWidth=8;brushCtx.lineJoin="round";
  brushCtx.beginPath();
  brushCtx.moveTo(20,48);brushCtx.lineTo(63,16);brushCtx.lineTo(92,36);
  brushCtx.lineTo(164,36);brushCtx.lineTo(194,16);brushCtx.lineTo(236,48);
  brushCtx.lineTo(224,101);brushCtx.lineTo(190,95);brushCtx.lineTo(194,236);
  brushCtx.lineTo(62,236);brushCtx.lineTo(66,95);brushCtx.lineTo(32,101);
  brushCtx.closePath();brushCtx.fill();brushCtx.stroke();
  brushCtx.beginPath();brushCtx.arc(128,26,34,0,Math.PI,false);brushCtx.stroke();
  if(variant==="red"){
    brushCtx.beginPath();brushCtx.moveTo(128,52);brushCtx.lineTo(128,232);brushCtx.stroke();
  }else{
    brushCtx.fillStyle="#ffe5aa";brushCtx.font="bold 36px sans-serif";
    brushCtx.textAlign="center";brushCtx.fillText("LAB",128,147);
  }
}
function storeCurrent(){closets.set(outfit.value,brushCtx.getImageData(0,0,256,256));}
outfit.addEventListener("change",()=>{
  const next=outfit.value;
  if(closets.has(next))brushCtx.putImageData(closets.get(next),0,0);
  else paintBase(next);
});
outfit.value="blue";paintBase("blue");storeCurrent();
outfit.value="red";paintBase("red");storeCurrent();
outfit.value="blue";brushCtx.putImageData(closets.get("blue"),0,0);

function pointerPosition(e){
  const b=fabric.getBoundingClientRect();
  return {x:(e.clientX-b.left)*256/b.width,y:(e.clientY-b.top)*256/b.height};
}
fabric.addEventListener("pointerdown",e=>{
  if(e.button!==0)return;
  drawing=true;lastBrushPos=pointerPosition(e);
  fabric.setPointerCapture(e.pointerId);
  brushCtx.strokeStyle=$("#ink").value;brushCtx.lineCap="round";
  brushCtx.lineJoin="round";brushCtx.lineWidth=Number($("#brush").value);
  brushCtx.beginPath();brushCtx.moveTo(lastBrushPos.x,lastBrushPos.y);
  brushCtx.lineTo(lastBrushPos.x+.1,lastBrushPos.y+.1);brushCtx.stroke();
  storeCurrent();
});
fabric.addEventListener("pointermove",e=>{
  if(!drawing)return;
  const p=pointerPosition(e);
  brushCtx.beginPath();brushCtx.moveTo(lastBrushPos.x,lastBrushPos.y);
  brushCtx.lineTo(p.x,p.y);brushCtx.stroke();
  lastBrushPos=p;storeCurrent();
});
function stopDrawing(){drawing=false;lastBrushPos=null;}
fabric.addEventListener("pointerup",stopDrawing);
fabric.addEventListener("pointercancel",stopDrawing);
$("#clear").addEventListener("click",()=>{paintBase(outfit.value);storeCurrent();});

$("#garment-file").addEventListener("change",async e=>{
  const file=e.target.files?.[0];e.target.value="";
  if(!file)return;
  if(!["image/png","image/webp"].includes(file.type)||file.size>8_000_000){
    status("Import refusé : PNG/WebP de 8 Mo maximum.");return;
  }
  const token=++loadToken, url=URL.createObjectURL(file),img=new Image();
  try{
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    if(token!==loadToken)return;
    if(!img.naturalWidth || !img.naturalHeight ||
      Math.max(img.naturalWidth,img.naturalHeight)>4096)
      throw new Error("Dimensions invalides (maximum 4096 px).");
    brushCtx.clearRect(0,0,256,256);
    brushCtx.drawImage(img,0,0,256,256);
    storeCurrent();
    status("Image importée dans la tenue "+outfit.value+". Ajustement expérimental actif.");
  }catch{status("Impossible d'ouvrir le vêtement demandé.");}
  finally{URL.revokeObjectURL(url);}
});
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),10_000);
}
$("#export-garment").addEventListener("click",()=>fabric.toBlob(blob=>{
  if(blob)downloadBlob(blob,"vtube-garment.png");
},"image/png"));

$("#save-replay").addEventListener("click",()=>{
  downloadBlob(new Blob([encodeReplay(replay)],{type:"application/json"}),
    "vtube-parameters-replay.json");
});
$("#load-replay").addEventListener("change",async e=>{
  const file=e.target.files?.[0];e.target.value="";
  if(!file)return;
  if(file.size>512_000){status("Replay trop volumineux.");return;}
  try{
    const next=decodeReplay(await file.text());
    replay=next;clock=0;timeInput.max=String(replay.durationMs);
    timeInput.value="0";mode.value="replay";status("Séquence importée, paramètres validés.");
  }catch(err){status("Séquence rejetée : "+err.message);}
});
$("#play").addEventListener("click",()=>{
  playing=!playing;$("#play").textContent=playing?"Pause":"Lecture";
});
$("#restart").addEventListener("click",()=>{clock=0;manualSpring={x:0,v:0};});
timeInput.addEventListener("input",()=>{
  clock=Number(timeInput.value);playing=false;$("#play").textContent="Lecture";
});
mode.addEventListener("change",()=>{manualSpring={x:0,v:0};status(
  mode.value==="vts"?"VTS Simulator : données simulées, AUCUNE connexion à VTube Studio.":
  "Mode changé. Aucun fichier ou paramètre n'est envoyé sur Internet."
);});
function drawBody(pose){
  const w=stage.width,h=stage.height;
  ctx.fillStyle="#172231";ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#314757";ctx.fillRect(0,h*.8,w,h*.2);
  ctx.save();
  ctx.strokeStyle="#c4ac9b";ctx.lineWidth=26;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(pose.shoulderLeft.x*w,pose.shoulderLeft.y*h);
  ctx.lineTo((pose.shoulderLeft.x-.11)*w,.63*h);
  ctx.moveTo(pose.shoulderRight.x*w,pose.shoulderRight.y*h);
  ctx.lineTo((pose.shoulderRight.x+.11)*w,.63*h);
  ctx.stroke();
  ctx.fillStyle="#c4ac9b";ctx.beginPath();
  ctx.moveTo(pose.shoulderLeft.x*w,pose.shoulderLeft.y*h);
  ctx.lineTo(pose.shoulderRight.x*w,pose.shoulderRight.y*h);
  ctx.lineTo(pose.waistRight.x*w,pose.waistRight.y*h);
  ctx.lineTo(pose.waistLeft.x*w,pose.waistLeft.y*h);
  ctx.fill();
  ctx.fillStyle="#b09e94";ctx.fillRect((pose.waistLeft.x+.02)*w,.68*h,.1*w,.2*h);
  ctx.fillRect((pose.waistRight.x-.12)*w,.68*h,.1*w,.2*h);
  ctx.fillStyle="#edc7ad";ctx.beginPath();
  ctx.ellipse(pose.head.x*w,pose.head.y*h,.09*w,.13*h,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#253149";
  for(const offset of [-.034,.034]){
    ctx.beginPath();ctx.arc((pose.head.x+offset)*w,.18*h,5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function drawFrame(ts){
  const seconds=Math.min(.05,Math.max(0,(ts-lastTime)/1000));lastTime=ts;
  if(playing)clock=(clock+seconds*1000)%replay.durationMs;
  if(mode.value!=="replay" && playing)clock=(clock+seconds*1000)%replay.durationMs;
  const m=mode.value;
  let params=sampleReplay(replay,clock);
  if(m==="auto"){
    params={ParamAngleX:20*Math.sin(clock/700),
      ParamBreath:.5+.5*Math.sin(clock/900)};
  }
  if(m==="manual"){
    params={ParamAngleX:Number(angleInput.value),ParamBreath:Number(breathInput.value)/100};
  }
  if(m==="vts"){
    // Fake VTS-like parameter driver, no camera, API or hidden tracking.
    params={ParamAngleX:27*Math.sin(clock/1100),
      ParamBreath:.5+.45*Math.sin(clock/600)};
  }
  params.ParamAngleX=Math.max(-30,Math.min(30,params.ParamAngleX??0));
  params.ParamBreath=Math.max(0,Math.min(1,params.ParamBreath??.5));
  if(m!=="manual"){
    angleInput.value=String(Math.round(params.ParamAngleX));
    breathInput.value=String(Math.round(params.ParamBreath*100));
  }
  const options={frequency:Number(frequency.value),damping:Number(damping.value)};
  let swing;
  if(m==="replay"){
    swing=simulateHemAt(replay,clock,options);
  }else{
    const target=-params.ParamAngleX/30*.12+params.ParamBreath*.035;
    manualSpring=springStep(manualSpring,target,seconds,options);
    swing=manualSpring.x;
  }
  const pose=bodyPose(params);
  drawBody(pose);
  const mesh=garmentMesh(pose,{columns:5,rows:5,hemSwing:swing});
  paintWarpedGarment(ctx,fabric,mesh,stage.width,stage.height);
  timeInput.max=String(replay.durationMs);
  timeInput.value=String(Math.round(clock));
  $("#time-value").textContent=(clock/1000).toFixed(1).replace(".",",")+" s";
  $("#angle-value").textContent=Math.round(params.ParamAngleX)+"°";
  $("#breath-value").textContent=Math.round(params.ParamBreath*100)+" %";
  $("#freq-value").textContent=options.frequency.toFixed(1).replace(".",",")+" Hz";
  $("#damping-value").textContent=options.damping.toFixed(2).replace(".",",");
  $("#pose-label").textContent="ParamAngleX "+Math.round(params.ParamAngleX)+"°";
  requestAnimationFrame(drawFrame);
}
requestAnimationFrame(drawFrame);
