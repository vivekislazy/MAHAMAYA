import React,{useEffect,useRef,Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {CameraControls} from '@react-three/drei/core/CameraControls';
import {Html} from '@react-three/drei/web/Html';
import {useSanctuaryMaterials} from './sanctuary/materials';
import {Architecture} from './sanctuary/Architecture';
import {Lamp,Garlands,Offerings} from './sanctuary/RitualObjects';
import {Worshipper} from './sanctuary/Worshipper';
import {FloatingDust} from './sanctuary/Atmosphere';
import {useSceneActivity} from '../hooks/useSceneActivity';

const Scene=({inside,lit,offered,onDiscover,t,onEnter,animate,reducedMotion,view,onReady})=>{
 const controls=useRef(),maps=useSanctuaryMaterials();
 useEffect(()=>{const camera=!inside?[0,3.35,15,0,3.1,-4]:view==='ritual'?[3.35,2.15,-4.4,1.65,1.3,-2.65]:[0,2.8,3.7,0,2.7,-5.2];controls.current?.setLookAt(...camera,!reducedMotion);},[inside,view,reducedMotion]);
 useEffect(()=>{onReady?.();},[onReady]);
 return <><color attach="background" args={['#1d1510']}/><fog attach="fog" args={['#231912',20,46]}/>
  <hemisphereLight args={['#ffead1','#443629',lit?1.3:.7]}/><ambientLight intensity={lit?.5:.24} color="#ffe1b5"/>
  <spotLight position={[-1,7,1]} target-position={[0,1.6,-5]} angle={.78} penumbra={.8} color="#ffd3a0" intensity={lit?135:48} distance={24} decay={1.4} castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.0003}/>
  <pointLight position={[0,5.3,-4]} color="#ffdcae" intensity={lit?25:9} distance={16}/><directionalLight position={[0,4,12]} color="#dfc6a9" intensity={lit?1.7:1.1}/>
  <CameraControls ref={controls} minDistance={2.5} maxDistance={25} minPolarAngle={.72} maxPolarAngle={1.68} smoothTime={reducedMotion?0:.8}/>
  <Architecture maps={maps} animate={animate}/><Garlands/>
  {[-4.6,-.8,3.6].flatMap((z,i)=>[-2.75,2.75].map(x=><Lamp key={`${x}${z}`} position={[x,0,z]} lit={lit} animate={animate} light={i===0}/>))}
  <group position={[0,.18,-.75]}><Offerings offered={offered} animate={animate} lit={lit}/></group><Worshipper animate={animate} lit={lit} fabric={maps.fabric}/><FloatingDust animate={animate}/>
  {!inside&&<Html position={[0,2.55,7]} center zIndexRange={[8,0]}><button className="world-enter" data-testid="world-enter" onClick={onEnter}>{t('ENTER THE SANCTUARY','মন্দিরে প্রবেশ করুন')}<span>↗</span></button></Html>}
  {inside&&view!=='ritual'&&[['idol',[0,6.18,-6.2],'The goddess','দেবী'],['craft',[-3.12,3.1,-1.4],'The artisan’s touch','শিল্পীর ছোঁয়া'],['lamp',[-2.75,1.66,-.8],'The ritual lamps','পুজোর প্রদীপ']].map(([id,position,en,bn])=><Html key={id} position={position} center zIndexRange={[8,0]}><button className="world-hotspot" data-testid={`hotspot-${id}`} onClick={()=>onDiscover(id)}><span>+</span>{t(en,bn)}</button></Html>)}
 </>;
};
export const Sanctuary=({motionEnabled=true,reducedMotion=false,...props})=>{
 const {host,active,inView,foreground}=useSceneActivity();
 const animate=motionEnabled&&!reducedMotion&&active;
 return <div ref={host} className="sanctuary-renderer" data-testid="sanctuary-renderer" data-animated={animate?'true':'false'} data-in-view={String(inView)} data-foreground={String(foreground)}><Canvas shadows camera={{position:[0,3.35,15],fov:48}} dpr={matchMedia('(pointer:coarse)').matches?1:[1,1.5]} frameloop={animate?'always':'demand'} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}><Suspense fallback={<Html center><span className="world-loading" data-testid="sanctuary-loading">{props.t('Lighting the sanctuary…','মণ্ডপ আলোকিত হচ্ছে…')}</span></Html>}><Scene {...props} animate={animate} reducedMotion={reducedMotion}/></Suspense></Canvas></div>;
};