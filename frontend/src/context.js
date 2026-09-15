import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const Context = createContext(null);
let audio;
export function tone(kind = 'bell') {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  audio ||= new Audio();
  audio.resume();
  const o = audio.createOscillator(), g = audio.createGain(), now = audio.currentTime;
  o.type = kind === 'drum' ? 'triangle' : 'sine';
  o.frequency.setValueAtTime(kind === 'drum' ? 170 : 660, now);
  o.frequency.exponentialRampToValueAtTime(kind === 'drum' ? 42 : 655, now + .3);
  g.gain.setValueAtTime(.0001, now); g.gain.exponentialRampToValueAtTime(.22, now + .01);
  g.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'drum' ? .45 : 2));
  o.connect(g); g.connect(audio.destination); o.start(); o.stop(now + 2.1);
}
export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('mahamaya-language') || 'en');
  const [visitor] = useState(() => {
    let id = localStorage.getItem('mahamaya-visitor');
    if (!id || !/^[0-9a-f-]{36}$/.test(id)) { id = crypto.randomUUID(); localStorage.setItem('mahamaya-visitor', id); }
    return id;
  });
  const [pandals, setPandals] = useState([]), [dates, setDates] = useState([]), [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [saving, setSaving] = useState(false);
  const [sound, setSound] = useState(false); const interval = useRef();
  const t = (en, bn) => lang === 'bn' && bn ? bn : en;
  useEffect(() => { localStorage.setItem('mahamaya-language', lang); document.documentElement.lang = lang; }, [lang]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const results = await Promise.all(['/pandals', '/dates', `/itinerary/${visitor}`].map(async p => {
        const r = await fetch(API + p); if (!r.ok) throw new Error(); return r.json();
      }));
      setPandals(results[0]); setDates(results[1]); setSaved(results[2].pandal_ids);
    } catch { setError('Could not load your guide. Please try again.'); }
    finally { setLoading(false); }
  }, [visitor]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (sound) { tone(); interval.current = setInterval(() => tone(), 6000); }
    return () => clearInterval(interval.current);
  }, [sound]);
  const toggleSave = async id => {
    if (saving) return;
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaving(true);
    try {
      const r = await fetch(`${API}/itinerary/${visitor}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({visitor_id:visitor, pandal_ids:next}) });
      if (!r.ok) throw new Error();
      setSaved((await r.json()).pandal_ids);
      toast.success(next.includes(id) ? t('Added to your Pujo trail', 'আপনার পুজোর পথে যোগ হয়েছে') : t('Removed from your trail', 'আপনার পথ থেকে সরানো হয়েছে'));
    } catch { toast.error(t('Could not save. Please try again.', 'সংরক্ষণ হয়নি। আবার চেষ্টা করুন।')); }
    finally { setSaving(false); }
  };
  return <Context.Provider value={{lang,setLang,t,visitor,pandals,dates,saved,toggleSave,saving,loading,error,retry:load,sound,setSound}}>{children}</Context.Provider>;
};
export const useApp = () => useContext(Context);