/**
 * Portable, versioned timeline. All samples are numeric and bounded.
 * No camera, cloud dependency, model binary or VTS access.
 */
export const TYPE="vtube-physics/replay";
export const VERSION=1;
export const MAX_DURATION=600_000;
export const MAX_CHANNELS=64;
export const MAX_KEYS=2048;
export const MAX_JSON_CHARS=512_000;
const ID=/^[A-Za-z][A-Za-z0-9_.:-]{0,79}$/;

export function validateReplay(value){
  if(!value || typeof value!=="object" ||
    value.type!==TYPE || value.version!==VERSION ||
    !Number.isInteger(value.durationMs) || value.durationMs<1 || value.durationMs>MAX_DURATION ||
    !Array.isArray(value.channels) || !value.channels.length ||
    value.channels.length>MAX_CHANNELS){
    throw new RangeError("Format, version ou durée du replay non valide.");
  }
  const known=new Set();
  const channels=value.channels.map(channel=>{
    if(!channel || typeof channel!=="object" ||
      typeof channel.id!=="string" || !ID.test(channel.id) || known.has(channel.id) ||
      !Number.isFinite(channel.min) || !Number.isFinite(channel.max) ||
      !Number.isFinite(channel.default) ||
      !(channel.min<channel.max) ||
      channel.default<channel.min || channel.default>channel.max ||
      !Array.isArray(channel.keys) || channel.keys.length>MAX_KEYS){
      throw new RangeError("Définition de canal non valide.");
    }
    known.add(channel.id);
    let prev=-1;
    const keys=channel.keys.map(key=>{
      if(!key || typeof key!=="object" || !Number.isInteger(key.t) ||
        key.t<=prev || key.t<0 || key.t>value.durationMs ||
        !Number.isFinite(key.v) || key.v<channel.min || key.v>channel.max)
        throw new RangeError("Point de replay hors plage, dupliqué ou non trié.");
      prev=key.t;
      return {t:key.t,v:key.v};
    });
    return {id:channel.id,min:channel.min,max:channel.max,
      default:channel.default,keys};
  });
  return {type:TYPE,version:VERSION,durationMs:value.durationMs,channels};
}

function interpolate(channel,t){
  const keys=channel.keys;
  if(!keys.length)return channel.default;
  if(t<keys[0].t)return channel.default;
  if(t>=keys.at(-1).t)return keys.at(-1).v;
  let lo=0,hi=keys.length-1;
  while(lo+1<hi){
    const mid=(lo+hi)>>1;
    if(keys[mid].t<=t)lo=mid;else hi=mid;
  }
  const a=keys[lo],b=keys[hi];
  const mix=(t-a.t)/(b.t-a.t);
  return a.v+(b.v-a.v)*mix;
}
export function sampleReplay(replay,timeMs){
  if(!Number.isFinite(timeMs))throw new RangeError("Temps de lecture non valide.");
  const t=Math.max(0,Math.min(replay.durationMs,timeMs));
  return Object.fromEntries(replay.channels.map(c=>[c.id,interpolate(c,t)]));
}
export function encodeReplay(replay){
  const json=JSON.stringify(validateReplay(replay),null,2)+"\n";
  if(json.length>MAX_JSON_CHARS)throw new RangeError("Replay trop volumineux.");
  return json;
}
export function decodeReplay(input){
  if(typeof input!=="string" || input.length>MAX_JSON_CHARS)
    throw new RangeError("Fichier de replay trop volumineux ou invalide.");
  return validateReplay(JSON.parse(input));
}
export function demoReplay(){
  const durationMs=8000;
  return validateReplay({type:TYPE,version:VERSION,durationMs,channels:[
    {id:"ParamAngleX",min:-30,max:30,default:0,
      keys:[{t:0,v:0},{t:1500,v:22},{t:3000,v:-20},{t:4700,v:25},
        {t:6200,v:-8},{t:8000,v:0}]},
    {id:"ParamBreath",min:0,max:1,default:0.5,
      keys:[{t:0,v:.5},{t:800,v:1},{t:1600,v:0},{t:2400,v:1},
        {t:3200,v:0},{t:4000,v:1},{t:4800,v:0},{t:5600,v:1},
        {t:6400,v:0},{t:7200,v:1},{t:8000,v:.5}]}
  ]});
}
