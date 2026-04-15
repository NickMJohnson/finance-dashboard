import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchGoals = createAsyncThunk('goals/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/goals');
    return data.goals;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createGoal = createAsyncThunk('goals/create', async (goal, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/goals', goal);
    return data.goal;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateGoal = createAsyncThunk('goals/update', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/goals/${id}`, updates);
    return data.goal;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteGoal = createAsyncThunk('goals/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/goals/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const goalSlice = createSlice({
  name: 'goals',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(createGoal.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g._id !== action.payload);
      });
  },
});

export default goalSlice.reducer;
