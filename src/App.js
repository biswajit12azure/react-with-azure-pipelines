import { Fragment } from 'react';
   import { useNavigate, useLocation } from 'react-router-dom';
   import React from 'react';
   import RouteList from './routes/RouteList';
   import { history } from '_utils';

   const App = () => {
     history.navigate = useNavigate();
     history.location = useLocation();

     return (
       <div>
         <React.StrictMode>
           <Fragment>
             <RouteList />
           </Fragment>
         </React.StrictMode>
       </div>
     );
   };

   export default App;