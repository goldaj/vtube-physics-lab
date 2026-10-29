/**
 * Canonical body landmark + automatic deformation spike.
 * No PSD parser, semantic garment segmentation, weight painting or Cubism rig.
 */
export function bodyPose(values){
  const angle=Number(values.ParamAngleX??0);
  const breath=Number(values.ParamBreath??.5);
  if(!Number.isFinite(angle)||!Number.isFinite(breath)||Math.abs(angle)>35 ||
    breath<0||breath>1)throw new RangeError("Paramètres du corps hors plage.");
  const cx=.5+angle*.0025;
  const incline=angle*.0007;
  const inflation=(breath-.5)*.025;
  return {
    head:{x:cx,y:.18},
    shoulderLeft:{x:cx-.17-incline,y:.37},
    shoulderRight:{x:cx+.17-incline,y:.37},
    waistLeft:{x:cx-.135-incline+inflation,y:.70},
    waistRight:{x:cx+.135-incline-inflation,y:.70}
  };
}
export function garmentMesh(pose,{columns=6,rows=6,hemSwing=0}={}){
  if(!Number.isInteger(columns)||columns<1||columns>24 ||
     !Number.isInteger(rows)||rows<1||rows>24 ||
     !Number.isFinite(hemSwing)||Math.abs(hemSwing)>.25)
    throw new RangeError("Grille ou force de tissu invalide.");
  const points=[];
  for(let j=0;j<=rows;j++){
    const v=j/rows,row=[];
    for(let i=0;i<=columns;i++){
      const u=i/columns;
      const xTop=pose.shoulderLeft.x+(pose.shoulderRight.x-pose.shoulderLeft.x)*u;
      const xBottom=pose.waistLeft.x+(pose.waistRight.x-pose.waistLeft.x)*u;
      const yTop=pose.shoulderLeft.y+(pose.shoulderRight.y-pose.shoulderLeft.y)*u;
      const yBottom=pose.waistLeft.y+(pose.waistRight.y-pose.waistLeft.y)*u;
      row.push({
        x:xTop*(1-v)+xBottom*v+hemSwing*v*v+
          .007*Math.sin(Math.PI*u)*Math.sin(Math.PI*v),
        y:yTop*(1-v)+yBottom*v+ .015*Math.sin(Math.PI*u)*v*v,
        u,v
      });
    }
    points.push(row);
  }
  return {columns,rows,points};
}
export function affineTriangle(src,dst){
  if(!Array.isArray(src)||src.length!==3||!Array.isArray(dst)||dst.length!==3)
    throw new RangeError("Trois sommets attendus.");
  const [p,q,r]=src,[a,b,c]=dst;
  const det=(q.x-p.x)*(r.y-p.y)-(r.x-p.x)*(q.y-p.y);
  if(!Number.isFinite(det)||Math.abs(det)<1e-10)
    throw new RangeError("Triangle de texture dégénéré.");
  const dx1=q.x-p.x,dy1=q.y-p.y,dx2=r.x-p.x,dy2=r.y-p.y;
  const bx1=b.x-a.x,by1=b.y-a.y,bx2=c.x-a.x,by2=c.y-a.y;
  const A=(bx1*dy2-bx2*dy1)/det;
  const B=(by1*dy2-by2*dy1)/det;
  const C=(bx2*dx1-bx1*dx2)/det;
  const D=(by2*dx1-by1*dx2)/det;
  return {a:A,b:B,c:C,d:D,e:a.x-A*p.x-C*p.y,f:a.y-B*p.x-D*p.y};
}
export function paintWarpedGarment(ctx,image,mesh,width,height){
  if(!image||!ctx||!mesh)throw new TypeError("Texture, canvas et maillage requis.");
  const sw=image.width,sh=image.height;
  if(!(sw>0&&sh>0&&width>0&&height>0))
    throw new RangeError("Dimensions invalides.");
  const triangle=(p,q,r)=>{
    const src=[p,q,r].map(v=>({x:v.u*sw,y:v.v*sh}));
    const dst=[p,q,r].map(v=>({x:v.x*width,y:v.y*height}));
    const m=affineTriangle(src,dst);
    ctx.save();
    try{
      ctx.beginPath();
      ctx.moveTo(dst[0].x,dst[0].y);
      ctx.lineTo(dst[1].x,dst[1].y);
      ctx.lineTo(dst[2].x,dst[2].y);
      ctx.closePath();ctx.clip();
      ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f);
      ctx.drawImage(image,0,0,sw,sh);
    }finally{ctx.restore();}
  };
  for(let j=0;j<mesh.rows;j++){
    for(let i=0;i<mesh.columns;i++){
      const a=mesh.points[j][i],b=mesh.points[j][i+1],
        c=mesh.points[j+1][i+1],d=mesh.points[j+1][i];
      triangle(a,b,d);triangle(b,c,d);
    }
  }
}
