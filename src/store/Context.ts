import React from 'react';
import { Store } from '../types';

export const StoreContext = React.createContext<Store | null>(null);
