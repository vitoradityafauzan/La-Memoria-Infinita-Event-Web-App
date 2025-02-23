'use client';

import { AppStore, makeStore } from '@/redux/store';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingComp from './loading';
import React from 'react';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return (
    <Provider store={storeRef.current}>
      <PersistGate
        persistor={persistStore(storeRef.current)}
        loading={<LoadingComp />}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
