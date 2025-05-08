import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Login } from 'container/loginPage';
import { Register } from 'container/registration';
import { MainLayout, RegisterMainLayout } from 'container/layout';

const LoginLayout = ({ isAuthenticated }) => {
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
    </div>
  );
};

export default LoginLayout;