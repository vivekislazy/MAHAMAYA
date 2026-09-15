import {useEffect,useRef,useState} from 'react';

export const useSceneActivity = () => {
  const host=useRef();
  const [inView,setInView]=useState(true);
  const [foreground,setForeground]=useState(()=>!document.hidden&&document.hasFocus());
  useEffect(()=>{
    const headerHeight=Math.ceil(document.querySelector('.site-header')?.getBoundingClientRect().height||0);
    const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting&&entry.intersectionRatio>=.12),{threshold:[0,.12],rootMargin:`-${headerHeight}px 0px 0px 0px`});
    observer.observe(host.current);
    const pause=()=>setForeground(false);
    const sync=()=>setForeground(!document.hidden&&document.hasFocus());
    const engage=()=>{if(!document.hidden)setForeground(true);};
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('blur',pause);window.addEventListener('focus',sync);
    window.addEventListener('pagehide',pause);window.addEventListener('pageshow',sync);
    window.addEventListener('pointerdown',engage);
    sync();
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);window.removeEventListener('blur',pause);window.removeEventListener('focus',sync);window.removeEventListener('pagehide',pause);window.removeEventListener('pageshow',sync);window.removeEventListener('pointerdown',engage);};
  },[]);
  return {host,active:inView&&foreground,inView,foreground};
};