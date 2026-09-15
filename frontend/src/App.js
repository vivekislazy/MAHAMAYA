import React, {Suspense, lazy} from 'react';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {AnimatePresence, motion, MotionConfig} from 'framer-motion';
import {AppProvider} from './context';
import {Header, Footer, SmoothScroll, CursorMesh} from './components/Shell';
import {Toaster} from './components/ui/sonner';
import Home from './pages/Home';
import './App.css';
const Explore=lazy(()=>import('./pages/Explore'));
const Experience=lazy(()=>import('./pages/Experience'));
const Story=lazy(()=>import('./pages/Story'));
const Music=lazy(()=>import('./pages/Music'));
const Gallery=lazy(()=>import('./pages/Gallery'));
const Guide=lazy(()=>import('./pages/Guide'));
function Pages(){const location=useLocation();return <AnimatePresence mode="wait"><motion.main key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}}><Suspense fallback={<div className="page-loading" data-testid="page-loading">MAHAMAYA <span>•••</span></div>}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/experience" element={<Experience/>}/><Route path="/story" element={<Story/>}/><Route path="/music" element={<Music/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/guide" element={<Guide/>}/><Route path="*" element={<div className="page-intro" data-testid="not-found"><h1>A little off the trail.</h1><a href="/" data-testid="not-found-home">Return home →</a></div>}/></Routes></Suspense></motion.main></AnimatePresence>;}
export default function App(){return <BrowserRouter><AppProvider><MotionConfig reducedMotion="user"><SmoothScroll/><Header/><Pages/><Footer/><CursorMesh/><Toaster position="bottom-right"/></MotionConfig></AppProvider></BrowserRouter>;}