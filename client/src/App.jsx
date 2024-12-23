import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import axios from 'axios';
import TestPage from './pages/test';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext, UserContextProvider } from '../context/userContext';

import React from 'react';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';


  function App() {
    const { user } = React.useContext(UserContext);
    
    return (
      <UserContextProvider>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route path="user-dashboard" element={<UserDashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </UserContextProvider>
    );
  }

export default App;
