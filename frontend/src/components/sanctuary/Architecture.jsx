import React,{useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useTexture} from '@react-three/drei/core/Texture';
import {PlaneGeometry,DoubleSide} from 'three';
import {BRASS,CLAY,profile} from './materials';
import alpona from '../../assets/alpona.svg';
import {photos} from '../shared';

const Column=({x,z,stone})=><group position={[x,0,z]} name="carved-terracotta-column">
 <mesh castShadow receiveShadow><latheGeometry args={[profile([[.46,0],[.46,.12],[.37,.17],[.37,.27],[.27,.35],[.23,.65],[.205,1.1],[.19,3.75],[.22,4.2],[.33,4.4],[.4,4.55],[.4,4.7],[.32,4.85]]),32]}/><meshStandardMaterial color={CLAY} map={stone} bumpMap={stone} bumpScale={.055} roughness={.87}/></mesh>
 {[.17,.3,.67,1.08,3.78,4.22,4.5,4.67].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[y>4?.36:y<.4?.37:.228,.018,8,32]}/><meshStandardMaterial color={BRASS} metalness={.55} roughness={.4}/></mesh>)}
 {Array.from({length:12},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI/6)*.192,2.4,Math.sin(i*Math.PI/6)*.192]}><cylinderGeometry args={[.009,.012,2.2,5]}/><meshStandardMaterial color="#c49561" roughness={.72}/></mesh>)}
 <mesh position={[0,.07,0]} receiveShadow><boxGeometry args={[.93,.14,.93]}/><meshStandardMaterial color="#735543" map={stone} roughness={.9}/></mesh>
</group>;
const Drapery=({side,z,fabric})=>{
 const geometry=useMemo(()=>{const g=new PlaneGeometry(3.4,4.9,36,14),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,Math.sin(x*12)*.115+Math.sin(x*5)*.06);if(y<-.6)p.setY(i,y+Math.cos(x*3)*.075);}g.computeVertexNormals();return g;},[]);
 React.useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <group name="pleated-silk-drape" position={[side*4.12,2.72,z]} rotation={[0,side===1?-Math.PI/2:Math.PI/2,0]}><mesh geometry={geometry} receiveShadow><meshStandardMaterial color="#70252d" map={fabric} bumpMap={fabric} bumpScale={.025} roughness={.82} side={DoubleSide}/></mesh>{[-2.25,2.29].map(y=><mesh key={y} position={[0,y,.14]}><boxGeometry args={[3.4,.045,.02]}/><meshStandardMaterial color={BRASS} map={fabric} metalness={.2} roughness={.7}/></mesh>)}</group>;
};
const HangingBell=({position,scale=1})=><group name="hanging-brass-bell" position={position} scale={scale}><mesh position={[0,.6,0]}><cylinderGeometry args={[.009,.009,1.2,6]}/><meshStandardMaterial color={BRASS} metalness={.7}/></mesh><mesh><latheGeometry args={[profile([[.18,0],[.2,.04],[.15,.08],[.1,.18],[.065,.29],[.03,.33]]),24]}/><meshStandardMaterial color={BRASS} metalness={.7} roughness={.28} side={DoubleSide}/></mesh><mesh position={[0,.035,0]}><sphereGeometry args={[.035,10,10]}/><meshStandardMaterial color="#e2c082" metalness={.6} roughness={.35}/></mesh></group>;
const FloorAlpona=({animate})=>{const map=useTexture(alpona),ref=useRef(),time=useRef(0);useFrame((_,d)=>{if(animate&&ref.current){time.current+=Math.min(d,.05);ref.current.rotation.z=-time.current*Math.PI*2/90;}});return <group position={[0,.037,-1.45]} rotation={[-Math.PI/2,0,0]}><mesh ref={ref} name="rotating-alpona-light"><planeGeometry args={[2.65,2.65]}/><meshBasicMaterial map={map} transparent opacity={.62} depthWrite={false} polygonOffset polygonOffsetFactor={-1}/></mesh></group>;};
const Shrine=({stone})=>{const map=useTexture(photos.idol);return <group name="crafted-shrine"><mesh position={[0,3.36,-6.6]}><planeGeometry args={[3.7,4.65]}/><meshBasicMaterial map={map} toneMapped={false}/></mesh>{[0,1,2].map(i=><group key={i} position={[0,0,-6.57+i*.06]}>{[-1,1].map(side=><mesh key={side} position={[side*(1.94+i*.075),3.36,0]} castShadow><boxGeometry args={[.085,4.82+i*.15,.11]}/><meshStandardMaterial color={i===1?'#5e3428':BRASS} metalness={i===1?.1:.58} roughness={.43}/></mesh>)}{[1,-1].map(side=><mesh key={side} position={[0,3.36+side*(2.38+i*.075),0]}><boxGeometry args={[3.96+i*.15,.085,.11]}/><meshStandardMaterial color={BRASS} metalness={.6} roughness={.4}/></mesh>)}</group>)}{Array.from({length:17},(_,i)=><mesh key={i} position={[-1.88+i*.235,5.96,-6.37]} rotation={[0,0,Math.PI/4]}><boxGeometry args={[.085,.085,.07]}/><meshStandardMaterial color={BRASS} metalness={.55} roughness={.4}/></mesh>)}{[0,1,2].map(i=><mesh key={i} position={[0,.1+i*.18,-5.45-i*.25]} castShadow receiveShadow><boxGeometry args={[6.1-i*.4,.2,3.6-i*.5]}/><meshStandardMaterial color={i===2?'#824b37':'#a0835c'} map={stone} bumpMap={stone} bumpScale={.03} roughness={.72}/></mesh>)}{[0,1,2].map(i=><mesh key={i} position={[0,.17+i*.18,-3.63]}><boxGeometry args={[6.1-i*.4,.016,.018]}/><meshStandardMaterial color={BRASS} metalness={.6} roughness={.4}/></mesh>)}</group>;};

export const Architecture=({maps,animate})=><group name="detailed-pandal-architecture">
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.03,1]} receiveShadow><planeGeometry args={[24,42]}/><meshStandardMaterial map={maps.floor} color="#c3a78d" roughness={.68} metalness={.05} bumpMap={maps.floor} bumpScale={.035}/></mesh>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,.015,2]} receiveShadow><planeGeometry args={[3.3,21]}/><meshStandardMaterial color="#792a32" map={maps.fabric} roughness={.99}/></mesh>
 {[-1.59,-1.49,1.49,1.59].map(x=><mesh key={x} position={[x,.025,2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.023,21]}/><meshStandardMaterial color="#ceb687" roughness={.8}/></mesh>)}
 {[-3.8,3.8].flatMap(x=>[-5,-1,3,7].map(z=><Column key={`${x}${z}`} x={x} z={z} stone={maps.stone}/>))}
 {[-5,-1,3,7].map(z=><group key={z}><mesh position={[0,4.77,z]} scale={[1,.64,1]} castShadow><torusGeometry args={[3.8,.19,12,72,Math.PI]}/><meshStandardMaterial color="#9a7752" map={maps.stone} roughness={.66} metalness={.2}/></mesh>{[3.56,3.79,4.01].map(r=><mesh key={r} position={[0,4.77,z+.16]} scale={[1,.64,1]}><torusGeometry args={[r,.028,6,72,Math.PI]}/><meshStandardMaterial color={BRASS} metalness={.55} roughness={.35}/></mesh>)}<HangingBell position={[0,5.72,z]} scale={.9}/>{[-1,1].map(side=><HangingBell key={side} position={[side*1.1,5.56,z]} scale={.65}/>)}</group>)}
 {[-1,1].flatMap(side=>[-5.05,-1.05,2.95,6.95].map(z=><Drapery key={`${side}${z}`} side={side} z={z} fabric={maps.fabric}/>))}
 <mesh position={[0,7.55,0]} receiveShadow><boxGeometry args={[8.6,.16,15.8]}/><meshStandardMaterial color="#452724" map={maps.fabric} roughness={1}/></mesh>
 {[-3,-1.5,0,1.5,3].map(x=><mesh key={x} position={[x,7.43,.3]}><boxGeometry args={[.06,.09,15.7]}/><meshStandardMaterial color="#ab8050" roughness={.67}/></mesh>)}
 <mesh position={[0,3.9,-7]} receiveShadow><boxGeometry args={[8.6,7.8,.3]}/><meshStandardMaterial color="#523029" map={maps.stone} roughness={.9}/></mesh>
 {[-3.2,3.2].map(x=><mesh key={x} position={[x,3.45,-6.81]}><boxGeometry args={[.055,6.1,.06]}/><meshStandardMaterial color={BRASS} metalness={.5} roughness={.4}/></mesh>)}
 <Shrine stone={maps.stone}/><FloorAlpona animate={animate}/>
</group>;