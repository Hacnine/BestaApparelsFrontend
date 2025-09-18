import { configureStore, Middleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userApi } from "./api/userApi";
import { auditApi } from "./api/auditApi";
import { dashboardApi } from "./api/dashboardApi";
import { tnaApi } from "./api/tnaApi";
import userReducer from "./slices/userSlice";
import { employeeApi } from "./api/employeeApi";
import { merchandiserApi } from "./api/merchandiserApi";
import { cadApi } from "./api/cadApi";

// No-op storage for server-side rendering
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

const storageEngine =
  typeof window !== "undefined" ? storage : createNoopStorage();

// Factory function for persist config
const createPersistConfig = (key: string, options = {}) => ({
  key,
  storage: storageEngine,
  ...options,
});

// Persist config for userSlice
const userPersistConfig = createPersistConfig("userSlice", {
  whitelist: ["user"],
});

// Wrap userReducer with persistReducer
const reducers = {
  userSlice: persistReducer(userPersistConfig, userReducer),
  [userApi.reducerPath]: userApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [tnaApi.reducerPath]: tnaApi.reducer,
  [merchandiserApi.reducerPath]: merchandiserApi.reducer,
  [cadApi.reducerPath]: cadApi.reducer,
};

// Configure store
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore redux-persist actions
      },
    }).concat([
      userApi.middleware,
      employeeApi.middleware,
      auditApi.middleware,
      dashboardApi.middleware,
      tnaApi.middleware,
      merchandiserApi.middleware,
      cadApi.middleware,
    ] as Middleware[]),
});

// Persistor for use in your app (e.g., <PersistGate>)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
