import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/auth/AuthContainer';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuthSuccess = (userData) => {
    login(userData);
    if (userData.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <AuthContainer
      initialView="login"
      onAuthSuccess={handleAuthSuccess}
      collegeDomain="pvpit.edu"
    />
  );
}
