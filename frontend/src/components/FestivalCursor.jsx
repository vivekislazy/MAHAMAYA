import React, {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import trishul from '../assets/trishul-cursor.svg';
import './Cursor.css';

const NATIVE = 'input, textarea, select, [contenteditable="true"], :disabled, [aria-disabled="true"], iframe, .leaflet-container, .sanctuary-canvas canvas, [data-native-cursor]';
export const FestivalCursor = () => {
  const pointer = useRef(), canvas = useRef(), symbol = useRef();
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const cursorElement = pointer.current, canvasElement = canvas.current, iconElement = symbol.current;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    let x = 0, y = 0, cx = 0, cy = 0, frame = 0, visible = false, clicks = 0, bursts = [];
    const root = document.documentElement;
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); canvasElement.width = innerWidth * dpr; canvasElement.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const hide = () => { visible = false; cursorElement.dataset.visible = 'false'; canvasElement.dataset.visible = 'false'; root.classList.remove('trishul-active'); cancelAnimationFrame(frame); frame = 0; bursts = []; ctx.clearRect(0, 0, innerWidth, innerHeight); };
    const draw = now => {
      frame = 0; if (!visible) return;
      cx += (x - cx) * .14; cy += (y - cy) * .14;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) {
        const distance = Math.hypot(a, b); if (distance > 5) continue;
        ctx.fillStyle = `rgba(166,115,54,${(1 - distance / 6) * .32})`;
        ctx.beginPath(); ctx.arc(cx + a * 13, cy + b * 13, .72, 0, Math.PI * 2); ctx.fill();
      }
      bursts = bursts.filter(b => now - b.time < 540);
      bursts.forEach(b => {
        const progress = Math.max(0, (now - b.time) / 540), radius = 5 + progress * 25;
        ctx.strokeStyle = `rgba(185,148,78,${(1 - progress) * .5})`; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.arc(b.x, b.y, radius * .7, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 8; i++) { const angle = i * Math.PI / 4; ctx.fillStyle = `rgba(190,149,78,${1 - progress})`; ctx.beginPath(); ctx.arc(b.x + Math.cos(angle) * radius, b.y + Math.sin(angle) * radius, 1.4 * (1 - progress) + .25, 0, 7); ctx.fill(); }
      });
      if (Math.abs(x - cx) + Math.abs(y - cy) > .08 || bursts.length) frame = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const move = e => {
      if (!media.matches || e.pointerType === 'touch' || e.target.closest?.(NATIVE)) { hide(); return; }
      x = e.clientX; y = e.clientY;
      if (!visible) { cx = x; cy = y; }
      visible = true; root.classList.add('trishul-active');
      cursorElement.dataset.visible = 'true'; canvasElement.dataset.visible = 'true';
      cursorElement.style.transform = `translate3d(${x - 16}px,${y - 2}px,0)`;
      schedule();
    };
    const press = e => {
      if (!visible || !media.matches || e.button !== 0 || e.target.closest?.(NATIVE)) return;
      cursorElement.dataset.clickCount = String(++clicks);
      bursts.push({x:e.clientX, y:e.clientY, time:performance.now()}); bursts = bursts.slice(-6);
      iconElement.getAnimations().forEach(a => a.cancel());
      iconElement.animate([{transform:'rotate(-18deg) scale(1)'},{transform:'rotate(-32deg) scale(.89)',offset:.3},{transform:'rotate(-12deg) scale(1.06)',offset:.65},{transform:'rotate(-18deg) scale(1)'}],{duration:430,easing:'cubic-bezier(.2,.7,.2,1)'});
      schedule();
    };
    const leave = e => { if (!e.relatedTarget) hide(); };
    const keyboard = e => { if (e.key === 'Tab') hide(); };
    resize();
    window.addEventListener('pointermove', move); window.addEventListener('pointerdown', press);
    window.addEventListener('pointerout', leave); window.addEventListener('blur', hide);
    window.addEventListener('resize', resize); window.addEventListener('keydown', keyboard);
    document.addEventListener('visibilitychange', hide); media.addEventListener('change', hide);
    return () => { hide(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', press); window.removeEventListener('pointerout', leave); window.removeEventListener('blur', hide); window.removeEventListener('resize', resize); window.removeEventListener('keydown', keyboard); document.removeEventListener('visibilitychange', hide); media.removeEventListener('change', hide); };
  }, []);
  return createPortal(<><canvas ref={canvas} className="festival-cursor-mesh" data-testid="cursor-mesh" data-visible="false" aria-hidden="true"/><div ref={pointer} className="festival-cursor" data-testid="trishul-cursor" data-visible="false" data-click-count="0" aria-hidden="true"><img ref={symbol} className="trishul-symbol" data-testid="trishul-symbol" src={trishul} alt="" draggable="false"/></div></>, document.body);
};