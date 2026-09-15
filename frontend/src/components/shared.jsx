import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Flower2 } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../context';

export const photos = {
  hero: 'https://images.unsplash.com/photo-1634066844026-40a34d6f36c0?auto=format&fit=crop&w=1400&q=85',
  idol: 'https://images.unsplash.com/photo-1634015158905-de840be0c62c?auto=format&fit=crop&w=1000&q=85',
  shrine: 'https://images.unsplash.com/photo-1616074385287-67f6fb9e9eb8?auto=format&fit=crop&w=1000&q=85',
  artisan: 'https://images.unsplash.com/photo-1593847794002-a67998d742fc?auto=format&fit=crop&w=1000&q=85',
  night: 'https://images.unsplash.com/photo-1728974617227-f9a2e0daec70?auto=format&fit=crop&w=1000&q=85',
  lamps: 'https://images.unsplash.com/photo-1636226942649-ee15d2a7ce04?auto=format&fit=crop&w=900&q=85',
  pandal: 'https://images.unsplash.com/photo-1728493118702-febd0b9a0fab?auto=format&fit=crop&w=1000&q=85',
};
export const Eyes = ({ className='' }) => <svg className={className} width="58" height="40" viewBox="0 0 100 62" fill="none" aria-hidden="true"><path d="M8 24C19 13 32 15 43 29C30 25 20 32 8 24ZM92 24C81 13 68 15 57 29C70 25 80 32 92 24Z" stroke="currentColor" strokeWidth="3"/><path d="M5 15C21 6 37 10 44 19M95 15C79 6 63 10 56 19M50 19V41L43 45H55M41 52Q50 59 59 52" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><ellipse cx="26" cy="23" rx="4" ry="5" fill="currentColor"/><ellipse cx="74" cy="23" rx="4" ry="5" fill="currentColor"/><path d="M50 1Q42 10 50 17Q58 10 50 1" fill="currentColor"/></svg>;
export const Reveal = ({ children, className='', delay=0 }) => <motion.div className={className} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.1}} transition={{duration:.8,delay,ease:[.2,.7,.2,1]}}>{children}</motion.div>;
export const Eyebrow = ({ children, id='chapter-label' }) => <div data-testid={id} className="eyebrow"><span className="tiny-star">✳</span>{children}</div>;
export const Action = ({ to, children, id, light=false, className='' }) => <Button asChild className={`action ${light?'action-light':''} ${className}`} data-testid={id}><Link to={to}>{children}<ArrowUpRight size={17}/></Link></Button>;
export const TextLink = ({ to, children, id }) => <Link className="text-link" to={to} data-testid={id}>{children}<ArrowRight size={17}/></Link>;
export const PageIntro = ({ chapter, title, italic, description }) => <header className="page-intro" data-testid="page-intro"><Reveal><Eyebrow>{chapter}</Eyebrow><h1 data-testid="page-title">{title} <em>{italic}</em></h1><p data-testid="page-description">{description}</p></Reveal><Flower2 className="intro-flower" strokeWidth={.5}/></header>;
export const DataState = () => {
  const {loading,error,t,retry} = useApp();
  return loading ? <div className="loading-state" data-testid="data-loading"><Flower2 className="spin"/>{t('Gathering a little wonder…','উৎসবের আয়োজন হচ্ছে…')}</div> : error ? <div className="error-state" data-testid="data-error"><p>{t(error,'তথ্য লোড হয়নি। আবার চেষ্টা করুন।')}</p><Button data-testid="retry-data" onClick={retry}>{t('Try again','আবার চেষ্টা করুন')}</Button></div> : null;
};