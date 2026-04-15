import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';

import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import AccountsPage from './pages/AccountsPage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={<PrivateRoute><Layout /></PrivateRoute>}
        >
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
