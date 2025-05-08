import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usePromiseTracker } from 'react-promise-tracker';
import { store, authActions } from '_store';
import PrivateRoute from './PrivateRoute';
import { Nav, LoadingOverlay, Notification, SessionTimeout } from '_components';
import { LoginLayout, ForgotPasswordLayout } from 'container/layout';
import { Home } from 'container/dashboard';
import Container from '@material-ui/core/Container';
import RegistrationLayout from 'container/layout/RegistrationLayout';
import { MyProfileDetails } from 'container/user';
import { DashboardLayout } from 'container/layout';
import { Configuration } from "container/configurations";
import UnderConstruction from "_components/UnderConstruction";
import { Users, Announcement, Support ,FAQ, Marketers, MarketersGroup } from "container/admin";
import { HomeEA, Jurisdiction } from 'container/energyAssistance';
import { AccountSearch, Upload } from 'container/accountInquiry';
import { getAppMenus } from '_utils';
import { AnnouncementView, FAQView } from 'container/headers';
import { HomeMC } from 'container/mapCenter';
import { HomeMB,PipelineDelivery,Nomination } from 'container/marketer';
import { HomeSD } from 'container/suplierDiversity';

const RouteList = () => {
    const promiseTracker = usePromiseTracker();
    const intervalRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = () => dispatch(authActions.logout());
    const auth = useSelector(x => x.auth.value);
    const thresholdMinsToRefreshTokenBeforeExpiry = 2; // 5 mins
    const isAuthenticated = useSelector(x => x.auth.isAuthenticated);//auth?.Succeeded;
    const savedMenuItems = localStorage.getItem('appMenuItems');

    const [appMenuItems, setAppMenuItems] = useState([]);

    useEffect(() => {
        const newMenu = savedMenuItems? JSON.parse(savedMenuItems) : [];
        setAppMenuItems(newMenu);
    }, [savedMenuItems]);

    const getToken = useCallback(() => {
        // Get new token if and only if existing token is available
        const auth = store.getState().auth.value;
        if (auth?.Data) {
            const tokenExpiry = auth?.Data?.UserDetails?.tokenExpiry;
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            const tokenExpiryDateTime = new Date(tokenExpiry);
            tokenExpiryDateTime.setMinutes(tokenExpiryDateTime.getMinutes() - thresholdMinsToRefreshTokenBeforeExpiry);
            const targetHours = tokenExpiryDateTime.getHours();
            const targetMinutes = tokenExpiryDateTime.getMinutes();
            const targetSeconds = tokenExpiryDateTime.getSeconds();
            if (hours === targetHours && minutes === targetMinutes && seconds === targetSeconds) {
                dispatch(authActions.refreshToken());
            }
        }
    }, []);

    // Trigger API to get a new token before token gets expired.
    useEffect(() => {
        const interval = setInterval(() => getToken(), 1000); // runs for every second an check if current time is same as time fore calling refresh token
        intervalRef.current = interval;
        return () => clearInterval(interval);
    }, [getToken]);

    const handleCardClick = (portalKey, isMBAdmin, path) => {
        const menus = getAppMenus(portalKey, isMBAdmin);
        setAppMenuItems(menus);
        localStorage.setItem('appMenuItems', JSON.stringify(menus));
        navigate(`/${path}`);
    };

    return (
        <div>
            <Nav isAuthenticated={isAuthenticated} />
            <Notification />
            <LoadingOverlay loading={promiseTracker.promiseInProgress}></LoadingOverlay>
           
            <div className="container inputtags admincontent">
            <Container maxWidth="lg" className="admincontentContainer">
            <DashboardLayout appMenuItems={appMenuItems} />
                <Routes >
                    {/* private */}
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="home" element={<Home handleCardClick={handleCardClick} />} />
                        {/* <Route element={<DashboardLayout appMenuItems={appMenuItems} />}> */}
                            <Route path='/profile' element={<MyProfileDetails />} />
                            <Route path='/userprofile' element={<Users />} />
                            <Route path="/configuration" element={<Configuration />} />
                            <Route path="/announcement" element={<Announcement />} />
                            <Route path="/marketer" element={<Marketers />} />
                            <Route path="/marketerGroup" element={<MarketersGroup />} />
                            <Route path="/faqCreate" element={<FAQ />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/dashboardEA" element={<HomeEA />} />
                            <Route path="/jurisdiction" element={<Jurisdiction />} />
                            <Route path="/dashboardAI" element={<AccountSearch />} />
                            <Route path="/upload" element={<Upload />} />
                            <Route path="/dashboardMC" element={<HomeMC />} />
                            {/* <Route path="/dashboardMB" element={<HomeMB />} /> */}
                            <Route path="/dashboardSD" element={<HomeSD />} />
                            <Route path="/faqView" element={<FAQView />} />
                            <Route path="/notification" element={<AnnouncementView />} />
                            <Route path="/pipelinedelivery"  element={<PipelineDelivery/>} />
                            <Route path="/nomination" element={<Nomination />}/>
                        {/* </Route> */}
                    </Route>
                    {/* public */}
                    <Route path="/*" element={<LoginLayout isAuthenticated={isAuthenticated} />} />
                    <Route path="registration/*" element={<RegistrationLayout />} />
                    <Route path="forgotpassword/*" element={<ForgotPasswordLayout />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <SessionTimeout onLogout={logout} isAuthenticated={isAuthenticated} />
                </Container>
            </div>
        </div>
    );
}

export default RouteList;