import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import { PortalRegistration, VerifiedRegistration, VerifyRegistration,Header } from "container/registration";
import ManageProfileMC from "container/mapCenter/ManageProfileMC";
import { ManageProfileSD } from "container/suplierDiversity";
import { FAQView } from "container/headers";

const RegistrationLayout = () => {

    return (
        
        <Routes>
            <Route path="verified" element={<VerifiedRegistration />} />
            <Route element={<Header />}>
            <Route path="mapCenter/:portalkey/:id" element={<ManageProfileMC />} />
            <Route path="diversity/:portalkey/:id" element={<ManageProfileSD />} />
            <Route path="/faqView" element={<FAQView />} />
            </Route>
        </Routes>
        
    );
}

export default RegistrationLayout;