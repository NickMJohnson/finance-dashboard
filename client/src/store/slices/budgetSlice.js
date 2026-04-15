import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBudgets = createAsyncThunk('budgets/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/budgets', { params });
    return data.budgets;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const upsertBudget = createAsyncThunk('budgets/upsert', async (budget, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/budgets', budget);
    return data.budget;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteBudget = createAsyncThunk('budgets/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/budgets/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(upsertBudget.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;
