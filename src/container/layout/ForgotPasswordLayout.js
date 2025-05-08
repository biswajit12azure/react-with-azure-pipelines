import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import { NewPassword } from "container/loginPage";

const ForgotPasswordLayout = () => {

    return (
        
        <Routes>
            <Route path="verified" element={<NewPassword />} />
        </Routes>
        
    );
}

export default ForgotPasswordLayout;