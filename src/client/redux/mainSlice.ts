import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setMain: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setMain } = mainSlice.actions;
