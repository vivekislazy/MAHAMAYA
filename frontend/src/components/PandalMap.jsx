import React, {useEffect} from 'react';
import {MapContainer,TileLayer,Marker,Popup,useMap} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useApp} from '../context';

const Focus=({selected})=>{const map=useMap();useEffect(()=>{if(selected)map.flyTo([selected.lat,selected.lng],14,{duration:.8});},[selected,map]);useEffect(()=>{const timer=setTimeout(()=>map.invalidateSize(),200);return()=>clearTimeout(timer);},[map]);return null;};
export const PandalMap=({pandals,selected,onSelect})=>{
 const {t}=useApp();
 return <MapContainer center={[22.565,88.365]} zoom={12} scrollWheelZoom={false} className="pandal-map" data-testid="pandal-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Focus selected={selected}/>{pandals.map((p,i)=><Marker key={p.id} position={[p.lat,p.lng]} title={t(p.name,p.name_bn)} icon={L.divIcon({className:'pandal-marker-wrap',html:`<span data-testid="map-marker-${p.id}" class="pandal-pin ${selected?.id===p.id?'selected':''}">${String(i+1).padStart(2,'0')}</span>`,iconSize:[38,44],iconAnchor:[19,40]})} eventHandlers={{click:()=>onSelect(p)}}><Popup><strong>{t(p.name,p.name_bn)}</strong><br/>{t(p.area,p.area_bn)}</Popup></Marker>)}</MapContainer>;
};