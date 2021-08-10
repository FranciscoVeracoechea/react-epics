import React, { FC } from 'react';
import { Store } from '../types';
import { StoreContext } from './Context';

type Props = {
  store: Store;
};

export const StoreProvider: FC<Props> = ({ store, children }) => {
  if (!store) {
    throw new Error(
      'could not find store prop; please ensure the StoreProvider has a valid store prop',
    );
  }
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
