import {sampleReplay} from "./replay.mjs";

/**
 * Fixed-step driven spring, evaluated from a known initial state.
 * Time is absolute, so replay at t is reproducible independent of rendering FPS.
 * This is a laboratory proxy for cloth lag, NOT Cubism's physics implementation.
 */
export function springStep(state,target,dt,{frequency=2.4,damping=.74}={}){
  if(!Number.isFinite(target)||!Number.isFinite(dt)||dt<0||dt>1/20 ||
    !Number.isFinite(frequency)||frequency<0.1||frequency>10||
    !Number.isFinite(damping)||damping<0||damping>3)
    throw new RangeError("Paramètres de ressort hors limites.");
  const omega=2*Math.PI*frequency;
  const acceleration=omega*omega*(target-state.x)-2*damping*omega*state.v;
  const v=state.v+acceleration*dt;
  const x=state.x+v*dt;
  return {x,v};
}
function targetFor(values){
  return -(values.ParamAngleX??0)/30*.12+(values.ParamBreath??.5)*.035;
}
export function simulateHemAt(replay,timeMs,settings={}){
  if(!Number.isFinite(timeMs))throw new RangeError("Temps physique invalide.");
  const t=Math.max(0,Math.min(replay.durationMs,timeMs));
  const dtMs=1000/120;
  const whole=Math.floor(t/dtMs);
  let state={x:targetFor(sampleReplay(replay,0)),v:0};
  for(let i=1;i<=whole;i++){
    const at=i*dtMs;
    state=springStep(state,targetFor(sampleReplay(replay,at)),dtMs/1000,settings);
  }
  const remain=t-whole*dtMs;
  if(remain>1e-7){
    state=springStep(state,targetFor(sampleReplay(replay,t)),remain/1000,settings);
  }
  return state.x;
}
