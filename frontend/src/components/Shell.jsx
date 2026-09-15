import React, {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {Menu, X, Volume2, VolumeX, ArrowUpRight} from 'lucide-react';
import Lenis from 'lenis';
import {useApp} from '../context';
import {Eyes} from './shared';
import './Cursor.css';

const nav = [['/explore','Pandal explorer','পুজো পরিক্রমা'],['/experience','The 3D experience','ত্রিমাত্রিক অভিজ্ঞতা'],['/story','Her story','মায়ের কাহিনি'],['/music','Sounds of Pujo','পুজোর সুর'],['/gallery','Gallery','চিত্রশালা']];
export const Header = () => {
  const {t,lang,setLang,sound,setSound} = useApp(); const [open,setOpen] = useState(false); const location=useLocation();
  useEffect(()=>setOpen(false),[location]);
  return <header className="site-header" data-testid="site-header"><Link to="/" className="brand" data-testid="brand-home"><Eyes/><div>MAHAMAYA<span>{t('THE SOUL OF BENGAL','বাংলার আত্মা')}</span></div></Link><nav className={open?'nav-links open':'nav-links'} aria-label={t('Main navigation','প্রধান নেভিগেশন')} data-testid="main-navigation">{nav.map(([to,en,bn])=><NavLink key={to} to={to} data-testid={`nav-${to.slice(1)}`}>{t(en,bn)}</NavLink>)}</nav><div className="header-actions"><button className="sound-button" data-testid="ambient-sound-toggle" onClick={()=>setSound(!sound)} aria-label={t(sound?'Mute ambient bells':'Enable ambient bells',sound?'ঘণ্টাধ্বনি বন্ধ করুন':'ঘণ্টাধ্বনি চালু করুন')} title={t('Ambient bells','ঘণ্টাধ্বনি')}>{sound?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button className="language" data-testid="language-toggle" onClick={()=>setLang(lang==='en'?'bn':'en')} aria-label={lang==='en'?'Switch to Bengali':'Switch to English'}><span className={lang==='en'?'active':''}>EN</span><i>/</i><span className={lang==='bn'?'active':''}>বাং</span></button><Link className="plan-button" to="/guide" data-testid="nav-guide">{t('Plan your Pujo','পুজোর পরিকল্পনা')}<ArrowUpRight size={15}/></Link><button className="mobile-menu" data-testid="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>;
};
export const Footer = () => {
  const {t}=useApp();
  return <footer className="site-footer" data-testid="site-footer"><div className="footer-top"><Eyes/><p data-testid="footer-message">{t('Some places you visit.','কিছু জায়গায় আপনি বেড়াতে যান।')}<br/><em>{t('Bengal, you feel.','বাংলাকে অনুভব করেন।')}</em></p><Link to="/explore" data-testid="footer-explore">{t('Find your way to wonder','বিস্ময়ের পথে চলুন')}<ArrowUpRight/></Link></div><div className="footer-bottom"><span data-testid="footer-copyright">© 2026 MAHAMAYA · {t('Made with love, for Bengal.','বাংলার জন্য ভালোবাসায় তৈরি।')}</span><span data-testid="footer-note">{t('An independent cultural guide. Not affiliated with Puja committees.','স্বতন্ত্র সাংস্কৃতিক নির্দেশিকা। পুজো কমিটির সঙ্গে যুক্ত নয়।')}</span><Link to="/guide" data-testid="footer-practical">{t('Visitor essentials','দর্শনার্থীর তথ্য')}</Link></div></footer>;
};
export const SmoothScroll = () => {
  const location=useLocation(); const ref=useRef();
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis=new Lenis({autoRaf:true,duration:1.1,prevent:node=>node.closest?.('.leaflet-container, [data-lenis-prevent]')}); ref.current=lenis;
    return ()=>lenis.destroy();
  },[]);
  useEffect(()=>{ref.current?.scrollTo(0,{immediate:true});window.scrollTo(0,0);},[location.pathname]);
  return null;
};
export const CursorMesh = () => {
  const ref=useRef();
  useEffect(()=>{
    if(matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const canvas=ref.current,ctx=canvas.getContext('2d'); let x=-300,y=-300,cx=-300,cy=-300,frame;
    const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;}; resize();
    const move=e=>{x=e.clientX;y=e.clientY;};
    const draw=()=>{cx+=(x-cx)*.1;cy+=(y-cy)*.1;ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++){const d=Math.hypot(a,b);if(d>5)continue;const dx=cx+a*14,dy=cy+b*14;ctx.fillStyle=`rgba(166,115,54,${(1-d/6)*.43})`;ctx.beginPath();ctx.arc(dx,dy,.85,0,7);ctx.fill();}
      frame=requestAnimationFrame(draw);
    };draw(); window.addEventListener('mousemove',move);window.addEventListener('resize',resize);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('mousemove',move);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} className="cursor-mesh" data-testid="cursor-mesh" aria-hidden="true"/>;
};