import { configureStore, Middleware } from '@reduxjs/toolkit';
import { userApi } from './api/userApi';
import { auditApi } from './api/auditApi';
import { dashboardApi } from './api/dashboardApi';
import { tnaApi } from './api/tnaApi';

import userReducer from "./slices/userSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["user"], // Add reducer keys here if you want to persist specific slices
};

// Combine all API reducers
const rootReducer = combineReducers({
   userSlice: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [tnaApi.reducerPath]: tnaApi.reducer,
});

// Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with explicit middleware typing
export const store = configureStore({
  
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      userApi.middleware,
      auditApi.middleware,
      dashboardApi.middleware,
      tnaApi.middleware,
    ] as Middleware[]),
});

// Persistor for use in your app (e.g., <PersistGate>)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
