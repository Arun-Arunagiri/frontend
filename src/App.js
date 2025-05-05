import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import PredictionPage from './pages/PredictionPage';
import Dashboard from './pages/Dashboard';

const App = () => {
  // const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        {/* <Route
          path="/predict"
          element={isAuthenticated ? <PredictionPage /> : <Navigate to="/login" />}
        /> */}
        <Route path='/predict' element={<PredictionPage/>}></Route>
      </Routes>
  );
};

export default App;
