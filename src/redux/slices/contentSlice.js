import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    selectedContent: 'jobs', 
  },
  reducers: {
    setSelectedContent: (state, action) => {
      state.selectedContent = action.payload;
    },
  },
});

export const { setSelectedContent } = contentSlice.actions;
export default contentSlice.reducer;
