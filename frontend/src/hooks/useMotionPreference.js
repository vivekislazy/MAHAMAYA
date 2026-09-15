import {useSyncExternalStore} from 'react';

const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const subscribe = notify => {preference.addEventListener('change',notify);return()=>preference.removeEventListener('change',notify);};
const snapshot = () => preference.matches;
export const useMotionPreference = () => useSyncExternalStore(subscribe,snapshot,()=>false);