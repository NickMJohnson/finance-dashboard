import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, authChecked: false },
  reducers: {
    logout(state) {
      state.user = null;
      state.authChecked = true;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    clearError(state) { state.error = null; },
    markAuthChecked(state) { state.authChecked = true; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, action) => { state.loading = false; state.user = action.payload; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => { fulfilled(state, action); state.authChecked = true; })
      .addCase(login.rejected, rejected)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => { fulfilled(state, action); state.authChecked = true; })
      .addCase(register.rejected, rejected)
      .addCase(fetchMe.pending, pending)
      .addCase(fetchMe.fulfilled, (state, action) => { fulfilled(state, action); state.authChecked = true; })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.authChecked = true;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { logout, clearError, markAuthChecked } = authSlice.actions;
export default authSlice.reducer;
