import React,{useEffect,useRef,Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {CameraControls} from '@react-three/drei/core/CameraControls';
import {Html} from '@react-three/drei/web/Html';
import {Float} from '@react-three/drei/core/Float';
import {useTexture} from '@react-three/drei/core/Texture';
import {DoubleSide} from 'three';
import {photos} from './shared';

const gold='#b9944e',sandstone='#b86b4d';
const Pillar=({x,z})=><group position={[x,0,z]}><mesh position={[0,2.6,0]}><cylinderGeometry args={[.21,.26,5.2,16]}/><meshStandardMaterial color={sandstone} roughness={.5}/></mesh>{[.18,.55,4.7,5.05].map(y=><mesh position={[0,y,0]} key={y}><cylinderGeometry args={[.37,.37,.15,16]}/><meshStandardMaterial color={gold} metalness={.65} roughness={.3}/></mesh>)}<mesh position={[0,.15,0]}><boxGeometry args={[.85,.3,.85]}/><meshStandardMaterial color={gold}/></mesh></group>;
const Lamp=({position,lit})=><group position={position}><mesh position={[0,.55,0]}><cylinderGeometry args={[.04,.09,1.1,12]}/><meshStandardMaterial color={gold} metalness={.6} roughness={.25}/></mesh><mesh position={[0,.12,0]}><cylinderGeometry args={[.28,.4,.2,24]}/><meshStandardMaterial color={gold} metalness={.6} roughness={.3}/></mesh><mesh position={[0,1.1,0]}><sphereGeometry args={[.28,20,10,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={gold} side={DoubleSide}/></mesh>{lit&&<><Float speed={3} floatIntensity={.05}><mesh position={[0,1.25,0]} scale={[.07,.2,.07]}><sphereGeometry args={[1,10,10]}/><meshBasicMaterial color="#ffe9a3"/></mesh></Float><pointLight position={[0,1.5,0]} color="#ffb955" intensity={9} distance={6}/></>}</group>;
const AltarImage=()=>{const texture=useTexture(photos.idol);return <mesh position={[0,3.3,-6.75]}><planeGeometry args={[4,4.7]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;};
const Petals=()=> <group>{Array.from({length:35},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*1.6,.27+Math.sin(i)*.03,-4.8+Math.cos(i*3.1)*.8]} rotation={[-Math.PI/2,0,i]}><circleGeometry args={[.085,6]}/><meshStandardMaterial color={i%2?'#e56029':'#e9a234'} side={DoubleSide}/></mesh>)}</group>;
const Scene=({inside,lit,offered,onDiscover,t,onEnter})=>{
 const controls=useRef();
 useEffect(()=>{controls.current?.setLookAt(0,inside?2.6:3.4,inside?3.3:15,0,3,-6,true);},[inside]);
 return <><color attach="background" args={['#21110d']}/><fog attach="fog" args={['#21110d',19,42]}/><ambientLight intensity={lit?1.35:.5} color="#ffddaf"/><directionalLight position={[1,10,8]} color="#ffdcb3" intensity={lit?2.8:1.1}/><pointLight position={[0,5,-4]} intensity={lit?65:22} color="#ffc983" distance={18}/><CameraControls ref={controls} minDistance={2} maxDistance={23} minPolarAngle={.65} maxPolarAngle={1.65} smoothTime={.8}/>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.06,0]}><planeGeometry args={[35,42]}/><meshStandardMaterial color="#754a32" roughness={.55} metalness={.1}/></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[0,0,2]}><planeGeometry args={[3.4,21]}/><meshStandardMaterial color="#871a26" roughness={.9}/></mesh>
 {[-1.65,1.65].map(x=><mesh key={x} position={[x,.015,2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.06,21]}/><meshStandardMaterial color={gold}/></mesh>)}
 {[-3.8,3.8].flatMap(x=>[-5,-1,3,7].map(z=><Pillar key={`${x}${z}`} x={x} z={z}/>))}
 {[-5,-1,3,7].map(z=><group key={z}><mesh position={[0,4.7,z]}><torusGeometry args={[3.8,.17,12,64,Math.PI]}/><meshStandardMaterial color={gold} metalness={.65} roughness={.4}/></mesh><mesh position={[0,4.7,z]}><torusGeometry args={[3.52,.045,8,64,Math.PI]}/><meshStandardMaterial color="#e9c676" metalness={.5}/></mesh><mesh position={[0,6.25,z]}><sphereGeometry args={[.14,16,16]}/><meshStandardMaterial color={gold}/></mesh></group>)}
 {[-4.2,4.2].map(x=><group key={x}><mesh position={[x,2.7,0]}><boxGeometry args={[.2,5.4,15]}/><meshStandardMaterial color="#842831" roughness={.95}/></mesh>{[-5,-3,-1,1,3,5,7].map(z=><mesh key={z} position={[x*.98,2.6,z]}><boxGeometry args={[.07,4.4,.035]}/><meshStandardMaterial color={gold}/></mesh>)}</group>)}
 <mesh position={[0,8,0]}><boxGeometry args={[8.6,.15,15]}/><meshStandardMaterial color="#652124" side={DoubleSide}/></mesh><mesh position={[0,4,-7]}><boxGeometry args={[8.6,8,.3]}/><meshStandardMaterial color="#542223"/></mesh>
 <mesh position={[0,.23,-5.6]}><boxGeometry args={[6,.46,3.4]}/><meshStandardMaterial color="#bb874d" metalness={.35} roughness={.45}/></mesh><mesh position={[0,.55,-6]}><boxGeometry args={[4.7,.25,2]}/><meshStandardMaterial color="#914028"/></mesh>
 <Suspense fallback={null}><AltarImage/></Suspense>{[-2.1,2.1].map(x=><mesh key={x} position={[x,3.3,-6.69]}><boxGeometry args={[.16,5,.15]}/><meshStandardMaterial color={gold} metalness={.6}/></mesh>)}{[.8,5.8].map(y=><mesh key={y} position={[0,y,-6.69]}><boxGeometry args={[4.36,.16,.15]}/><meshStandardMaterial color={gold} metalness={.6}/></mesh>)}
 {[-5,-1,3].flatMap(z=>[-2.8,2.8].map(x=><Lamp key={`${x}${z}`} position={[x,0,z]} lit={lit}/>))}
 {[-2.7,2.7].map(x=><group key={x} position={[x,4.7,-6.45]}>{Array.from({length:24},(_,i)=><mesh key={i} position={[0,-i*.14,0]}><sphereGeometry args={[.1,8,8]}/><meshStandardMaterial color={i%2?'#e6aa30':'#ce5017'}/></mesh>)}</group>)}
 {offered&&<Petals/>}
 {!inside&&<Html position={[0,2.5,7]} center><button className="world-enter" data-testid="world-enter" onClick={onEnter}>{t('ENTER THE SANCTUARY','মন্দিরে প্রবেশ করুন')} <span>↗</span></button></Html>}
 {inside&&[['idol',[0,5.9,-6.3],'The goddess','দেবী'],['craft',[-3.1,3.7,-2],'The artisan’s touch','শিল্পীর ছোঁয়া'],['lamp',[2.8,1.9,-1],'The ritual lamps','পুজোর প্রদীপ']].map(([id,position,en,bn])=><Html key={id} position={position} center><button className="world-hotspot" data-testid={`hotspot-${id}`} onClick={()=>onDiscover(id)}><span>+</span>{t(en,bn)}</button></Html>)}
 </>;
};
export const Sanctuary=props=><Canvas camera={{position:[0,3.4,15],fov:48}} dpr={[1,1.5]} gl={{antialias:true,alpha:false}}><Scene {...props}/></Canvas>;