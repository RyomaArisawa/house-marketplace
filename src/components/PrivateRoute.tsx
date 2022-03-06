import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SIGN_IN } from '../consts/routerPaths';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { Spinner } from './Spinner';

export const PrivateRoute = () => {
  /* Local States */
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to={SIGN_IN} />;
};
