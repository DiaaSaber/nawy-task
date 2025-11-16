import { configureStore } from '@reduxjs/toolkit';
import apartmentsReducer from './apartmentsSlice';

export const store = configureStore({
  reducer: {
    apartments: apartmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
