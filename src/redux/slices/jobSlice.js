import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await axios.get('https://swadesh0287.github.io/assessments/index.json/jobs');
  return response.data;
});

export const addJob = createAsyncThunk('jobs/addJob', async (jobData) => {
  const response = await axios.post('https://swadesh0287.github.io/assessments/index.json/jobs', jobData);
  return response.data;
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, updatedJob }) => {
  await axios.put(`https://swadesh0287.github.io/assessments/index.json/jobs/${id}`, updatedJob);
  return { id, updatedJob };
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id) => {
  await axios.delete(`https://swadesh0287.github.io/assessments/index.json/jobs/${id}`);
  return id;
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) state.jobs[index] = { ...state.jobs[index], ...action.payload.updatedJob };
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      });
  },
});

export default jobSlice.reducer;
