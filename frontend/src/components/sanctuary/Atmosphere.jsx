import React,{useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {CanvasTexture,AdditiveBlending,BufferGeometry,Float32BufferAttribute} from 'three';

const smokeTexture=()=>{const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,'rgba(255,247,229,.48)');g.addColorStop(.35,'rgba(255,247,229,.18)');g.addColorStop(1,'rgba(255,247,229,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);return new CanvasTexture(c);};
export const Incense=({position=[0,0,0],animate=true,active=true})=>{
 const group=useRef(),time=useRef(0);const texture=useMemo(smokeTexture,[]);
 React.useEffect(()=>()=>texture.dispose(),[texture]);
 useFrame((_,delta)=>{if(!animate||!active)return;time.current+=Math.min(delta,.05);group.current?.children.forEach((sprite,i)=>{const p=(time.current*.2+i/14)%1;sprite.position.set(Math.sin(p*7+i)*.12*p,p*1.6,Math.cos(p*5+i)*.06);sprite.scale.setScalar(.09+p*.62);sprite.material.opacity=Math.sin(p*Math.PI)*.35;});});
 return <group name="rising-incense" ref={group} position={position} visible={active}>{Array.from({length:14},(_,i)=><sprite key={i} position={[Math.sin(i)*.04,i/14*1.4,0]} scale={.12+i*.025}><spriteMaterial map={texture} color="#f1e3ce" transparent opacity={.2} depthWrite={false}/></sprite>)}</group>;
};
export const FloatingDust=({animate=true})=>{const ref=useRef(),time=useRef(0);const geometry=useMemo(()=>{const points=Array.from({length:100},(_,i)=>[Math.sin(i*27.3)*3.6,.8+(i%19)*.32,Math.cos(i*4.79)*7]).flat();const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(points,3));return g;},[]);React.useEffect(()=>()=>geometry.dispose(),[geometry]);useFrame((_,d)=>{if(animate&&ref.current){time.current+=Math.min(d,.05);ref.current.rotation.y=Math.sin(time.current*.03)*.1;ref.current.position.y=Math.sin(time.current*.17)*.12;}});return <points name="warm-air-motes" ref={ref} geometry={geometry}><pointsMaterial size={.014} color="#f2c47f" transparent opacity={.42} depthWrite={false} blending={AdditiveBlending}/></points>;};