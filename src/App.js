import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
// import Dashboard from './components/Dashboard';
import Invitations from './components/Invitations';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* <Route path="/invitations" element={
        <PrivateRoute>
          <Invitations />
        </PrivateRoute>
      } /> */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;

