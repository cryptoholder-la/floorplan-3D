import { configureStore } from '@reduxjs/toolkit';
import { catalogReducer } from './store/catalogSlice';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
