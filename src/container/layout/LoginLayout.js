import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Login } from 'container/loginPage';
import { Register } from 'container/registration';
import Box from '@mui/material/Box';
import { MainLayout, RegisterMainLayout } from 'container/layout';
import { useEffect } from 'react';
import { authActions } from '_store';
import Footer from '../dashboard/Footer';
const LoginLayout = ({ isAuthenticated }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.clear());
  }, []
  )
  // Redirect to home if already logged in
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }



  return (
    <div className="login-container">
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route element={<RegisterMainLayout />}>
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
      <Box className="clear-both">
      </Box>
      <Footer/>
    </div>
  );
};

export default LoginLayout;