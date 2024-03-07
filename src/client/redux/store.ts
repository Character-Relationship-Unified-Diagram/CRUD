import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from './mainSlice';

const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
