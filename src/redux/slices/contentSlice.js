// contentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    selectedContent: 'jobs', // Default content
  },
  reducers: {
    setSelectedContent: (state, action) => {
      state.selectedContent = action.payload;
    },
  },
});

export const { setSelectedContent } = contentSlice.actions;
export default contentSlice.reducer;
