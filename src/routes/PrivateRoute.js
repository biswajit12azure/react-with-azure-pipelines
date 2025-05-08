import { Navigate, Outlet } from 'react-router-dom';
import {history} from '_utils';

const PrivateRoute =({isAuthenticated})=> {

    if (!isAuthenticated) {
      // not logged in so redirect to login page with the return url
      return <Navigate to="/" state={{ from: history.location }} />
  }

    // authorized so return outlet for child routes
    return <Outlet />;
}

export default PrivateRoute;