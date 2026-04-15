import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchSpendingByCategory = createAsyncThunk(
  'transactions/byCategory',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions/analytics/by-category', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchMonthlyTotals = createAsyncThunk(
  'transactions/monthly',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions/analytics/monthly', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [], total: 0, page: 1, pages: 1,
    categoryData: [], monthlyData: [],
    loading: false, error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.transactions;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(fetchSpendingByCategory.fulfilled, (state, action) => {
        state.categoryData = action.payload;
      })
      .addCase(fetchMonthlyTotals.fulfilled, (state, action) => {
        state.monthlyData = action.payload;
      });
  },
});

export default transactionSlice.reducer;
