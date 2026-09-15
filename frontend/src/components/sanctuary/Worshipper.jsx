import React,{useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {profile} from './materials';
import {BrassBowl} from './RitualObjects';
import {Incense} from './Atmosphere';

const skin='#a87553';
const Ellipsoid=({position,scale,color=skin,rotation=[0,0,0]})=><mesh position={position} scale={scale} rotation={rotation} castShadow><sphereGeometry args={[1,20,16]}/><meshStandardMaterial color={color} roughness={.86}/></mesh>;
export const Worshipper=({animate=true,lit=true,fabric})=>{
 const body=useRef(),arms=useRef(),time=useRef(0);
 useFrame((_,d)=>{if(!animate)return;time.current+=Math.min(d,.05);const s=time.current;body.current.rotation.z=Math.sin(s*.75)*.013;body.current.rotation.x=Math.sin(s*.75)*.009;arms.current.position.x=Math.sin(s*.9)*.04;arms.current.position.y=1.28+Math.cos(s*.9)*.022;arms.current.rotation.y=Math.sin(s*.9)*.07;});
 return <group name="animated-worshipper" position={[1.8,0,-2.7]} rotation={[0,Math.PI-.55,0]}>
  <Ellipsoid position={[-.13,.075,.095]} scale={[.085,.064,.19]}/><Ellipsoid position={[.13,.075,.095]} scale={[.085,.064,.19]}/>
  <mesh position={[0,.16,0]} castShadow><latheGeometry args={[profile([[.26,0],[.29,.08],[.3,.25],[.27,.5],[.23,.72],[.22,.79]]),28]}/><meshStandardMaterial color="#e7dcc4" map={fabric} roughness={.93}/></mesh>
  {[-.19,-.1,0,.1,.19].map((x,i)=><mesh key={i} position={[x,.48,.245]} rotation={[.03,0,(i-2)*.045]} scale={[.027,.32,.04]} castShadow><sphereGeometry args={[1,10,10]}/><meshStandardMaterial color={i%2?'#d5c7ae':'#eee3ce'} map={fabric} roughness={1}/></mesh>)}
  <group ref={body}>
   <mesh position={[0,.92,0]} castShadow><latheGeometry args={[profile([[.21,0],[.22,.2],[.31,.47],[.3,.55],[.16,.67]]),24]}/><meshStandardMaterial color="#dfcfb2" map={fabric} roughness={.95}/></mesh>
   <Ellipsoid position={[0,1.62,0]} scale={[.08,.13,.08]}/><Ellipsoid position={[0,1.88,.014]} scale={[.165,.22,.157]}/>
   <Ellipsoid position={[0,1.996,-.012]} scale={[.169,.12,.158]} color="#2e241e"/>
   <Ellipsoid position={[0,1.87,.155]} scale={[.03,.043,.052]}/>
   {[-1,1].map(side=><group key={side}><Ellipsoid position={[side*.158,1.885,0]} scale={[.032,.06,.025]}/><Ellipsoid position={[side*.062,1.908,.148]} scale={[.012,.009,.006]} color="#34251b"/></group>)}
   <mesh position={[.19,1.15,.219]} rotation={[.02,0,-.05]} castShadow><boxGeometry args={[.13,.73,.035]}/><meshStandardMaterial color="#8f2631" map={fabric} roughness={.83}/></mesh>
   <mesh position={[.19,1.49,-.07]} rotation={[.6,0,0]} castShadow><boxGeometry args={[.135,.16,.3]}/><meshStandardMaterial color="#8f2631" map={fabric} roughness={.83}/></mesh>
   {[.84,.89,1.43].map(y=><mesh key={y} position={[.19,y,.242]}><boxGeometry args={[.134,.015,.009]}/><meshStandardMaterial color="#bd9656" metalness={.2} roughness={.65}/></mesh>)}
  </group>
  <group ref={arms} position={[0,1.28,0]}>
   <Ellipsoid position={[-.265,-.015,.1]} scale={[.082,.19,.08]} rotation={[-.65,0,-.16]}/><Ellipsoid position={[.265,-.015,.1]} scale={[.082,.19,.08]} rotation={[-.65,0,.16]}/>
   <Ellipsoid position={[-.17,-.125,.28]} scale={[.062,.075,.21]} rotation={[0,-.38,.1]}/><Ellipsoid position={[.17,-.125,.28]} scale={[.062,.075,.21]} rotation={[0,.38,-.1]}/>
   <Ellipsoid position={[-.064,-.09,.43]} scale={[.068,.04,.086]}/><Ellipsoid position={[.064,-.09,.43]} scale={[.068,.04,.086]}/>
   <group position={[0,-.065,.47]}><BrassBowl scale={.63}/><mesh position={[0,.205,0]}><cylinderGeometry args={[.125,.1,.02,16]}/><meshStandardMaterial color="#57311e" emissive={lit?'#b84d19':'#000000'} emissiveIntensity={lit?.6:0}/></mesh><Incense position={[0,.235,0]} animate={animate} active={lit}/>{lit&&<pointLight position={[0,.34,0]} color="#ffc48a" intensity={1.5} distance={2}/>}</group>
  </group>
 </group>;
};