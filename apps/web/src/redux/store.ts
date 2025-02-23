import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, Persistor } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import userReducer from './slice/authorSlice';
import { REHYDRATE, PERSIST, REGISTER } from 'redux-persist';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const persistConfig = {
  key: 'store',
  storage,
  timeout: 2000,
};

const rootReducer = combineReducers({
  user: userReducer,
});

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [REHYDRATE, PERSIST, REGISTER],
        },
      }),
  });

type StoreWithPersistor = ReturnType<typeof makeConfiguredStore> & {
  __persistor?: Persistor;
};

export const makeStore = (): StoreWithPersistor => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [REHYDRATE, PERSIST, REGISTER],
          },
        }),
    }) as StoreWithPersistor;
    store.__persistor = persistStore(store);
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
