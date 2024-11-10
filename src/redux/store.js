import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import jobReducer from './slices/jobSlice';


const store = configureStore({
  reducer: {
    content: contentReducer,
    jobs: jobReducer,
    
  },
});

export default store;
