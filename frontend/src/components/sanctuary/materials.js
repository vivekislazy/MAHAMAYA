import {useEffect, useMemo} from 'react';
import {CanvasTexture, RepeatWrapping, SRGBColorSpace, Vector2} from 'three';

const noise = (x,y) => {const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);};
const texture = kind => {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');
  c.fillStyle=kind==='floor'?'#877366':'#d2c5ae';c.fillRect(0,0,256,256);
  for(let y=0;y<256;y+=2)for(let x=0;x<256;x+=2){const n=noise(x,y);c.fillStyle=`rgba(${n>.5?'255,246,225':'41,24,13'},${n*.13})`;c.fillRect(x,y,2,2);}
  if(kind==='fabric') {for(let n=0;n<256;n+=3){c.strokeStyle=n%2?'#5c4c3630':'#fff3d040';c.lineWidth=.5;c.beginPath();c.moveTo(n,0);c.lineTo(n,256);c.moveTo(0,n);c.lineTo(256,n);c.stroke();}}
  if(kind==='stone') {for(let i=0;i<11;i++){c.strokeStyle='#77645130';c.lineWidth=.5;c.beginPath();c.moveTo(0,i*24);c.bezierCurveTo(60,30+i*20,160,i*24-20,256,i*22+10);c.stroke();}}
  if(kind==='floor') {c.strokeStyle='#352419';c.lineWidth=2;c.strokeRect(0,0,256,256);c.strokeStyle='#c9ae7e70';c.lineWidth=1;c.strokeRect(8,8,240,240);c.beginPath();c.moveTo(128,47);c.lineTo(209,128);c.lineTo(128,209);c.lineTo(47,128);c.closePath();c.stroke();}
  const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;map.wrapS=map.wrapT=RepeatWrapping;
  map.repeat.set(...(kind==='floor'?[12,21]:kind==='fabric'?[4,4]:[2,3]));map.anisotropy=4;return map;
};
export const useSanctuaryMaterials=()=>{const maps=useMemo(()=>({stone:texture('stone'),floor:texture('floor'),fabric:texture('fabric')}),[]);useEffect(()=>()=>Object.values(maps).forEach(t=>t.dispose()),[maps]);return maps;};
export const profile = coords => coords.map(([r,y])=>new Vector2(r,y));
export const BRASS='#b59250';
export const CLAY='#8d5440';