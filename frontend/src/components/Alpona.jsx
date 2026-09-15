import React from 'react';
import alpona from '../assets/alpona.svg';
import './Alpona.css';

export const Alpona = ({className='', id='alpona-decoration'}) => <div className={`alpona-decoration ${className}`} data-testid={id} aria-hidden="true"><img src={alpona} className="alpona-turn" alt="" draggable="false"/></div>;