import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { alertActions } from '_store';
import { history, fetchWrapper } from '_utils';
import msalInstance from 'authConfig';
// import { SessionStorage } from '@azure/msal-browser';

// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        value: JSON.parse(sessionStorage.getItem('auth')),
        userId: sessionStorage.getItem('userId'),
        isAuthenticated: sessionStorage.getItem('isAuthenticated')
    }
}

function createReducers() {
    return {
        setAuth,
        clear
    };

    function setAuth(state, action) {
        state.value = action.payload;
        if (action.payload !== null) {
            const { Data: { UserDetails: { id } } } = action.payload;
            state.userId = id;
            const { Succeeded } = action.payload;
            state.isAuthenticated = Succeeded;
            return;
        }
        state.userId = action.payload;
        state.isAuthenticated = action.payload;
    }

    function clear(state)
    {
        state.userId=null;
        state.isAuthenticated=null;
        state.value=null;
        sessionStorage.removeItem('auth');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('appMenuItems');
        sessionStorage.removeItem('portalID');
        sessionStorage.removeItem('isInternalUser');
        sessionStorage.removeItem('breadcrumb');
        sessionStorage.removeItem('mapcenterUserID');
    }
}

function createExtraActions() {
    // const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        login: login(),
        loginSSO: loginSSO(),
        logout: logout(),
        refreshToken: refreshToken(),
        forgotPasswordRequest: forgotPasswordRequest(),
        resetPasswordRequest: resetPasswordRequest(),
        userPasswordVerification:userPasswordVerification(),
        resetPasswordByUser:resetPasswordByUser(),
        generateOtp: generateOtp(),
        validateOtp: validateOtp()
    };

    function login() {
        return createAsyncThunk(
            `${name}/login`, async ({ Email, Password }, { dispatch }) => {
                dispatch(alertActions.clear());
                try {
                    const user = await trackPromise(fetchWrapper.post(`${baseUrl}/Authenticate`, { Email, Password }));
                    // set auth user in redux state
                    dispatch(authActions.setAuth(user));
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('auth', JSON.stringify(user));
                    if (user) {
                        const { Data: { UserDetails: { id } } } = user;
                        const { Succeeded } = user;

                        sessionStorage.setItem('isAuthenticated', Succeeded);
                        sessionStorage.setItem('userId', id);
                    }

                } catch (error) {
                    if (error instanceof TypeError) {
                        console.error('Network error:', error);
                        dispatch(alertActions.error({ message: 'Network error: Please check your internet connection.', header: "Login Failed", showAfterRedirect: true }));
                    } else {
                        console.error('Failed to fetch:', error);
                        dispatch(alertActions.error({ message: error || 'An unexpected error occurred.', header: "Login Failed", showAfterRedirect: true }));
                    }
                }
            }
        );
    }

    function loginSSO() {
        return createAsyncThunk(
            `${name}/loginSSO`, async ({ MicroEntraToken }, { dispatch }) => {
                dispatch(alertActions.clear());
                try {
                    const user = await trackPromise(fetchWrapper.post(`${baseUrl}/AuthenticateByMicroEntraToken`, { MicroEntraToken }));
                    // set auth user in redux state
                    dispatch(authActions.setAuth(user));
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('auth', JSON.stringify(user));
                    if (user) {
                        const { Data: { UserDetails: { id } } } = user;
                        const { Succeeded } = user;

                        sessionStorage.setItem('isAuthenticated', Succeeded);
                        sessionStorage.setItem('userId', id);
                    }
                    console.log('userResponse',user);

                } catch (error) {
                    if (error instanceof TypeError) {
                        console.error('Network error:', error);
                        dispatch(alertActions.error({ message: 'Network error: Please check your internet connection.', header: "Login Failed", showAfterRedirect: true }));
                    } else {
                        console.error('Failed to fetch:', error);
                        dispatch(alertActions.error({ message: error || 'An unexpected error occurred.', header: "Login Failed", showAfterRedirect: true }));
                    }
                }
            }
        );
    }

    function logout() {
        return createAsyncThunk(
            `${name}/logout`, async (arg, { dispatch }) => {
                try {
                    //console.log(`${window.location.origin}/`);
                    const isInternalUser = JSON.parse(sessionStorage.getItem('isInternalUser'));
                    if (isInternalUser) {
                        sessionStorage.removeItem('isInternalUser');
                        await msalInstance.initialize();
                        await msalInstance.logoutPopup({
                            postLogoutRedirectUri: `${window.location.origin}/`,
                        });
                    }
                    dispatch(authActions.setAuth(null));
                } catch (error) {
                    dispatch(alertActions.error({ message: error, header: "Logout Failed", showAfterRedirect: true }));
                }
                finally {
                    dispatch(authActions.setAuth(null));
                    sessionStorage.removeItem('auth');
                    sessionStorage.removeItem('isAuthenticated');
                    sessionStorage.removeItem('userId');
                    sessionStorage.removeItem('appMenuItems');
                    sessionStorage.removeItem('portalID');
                    sessionStorage.removeItem('isInternalUser');
                    sessionStorage.removeItem('breadcrumb');
                    sessionStorage.removeItem('mapcenterUserID');
                    history.navigate('/');
                }
            }
        );
    }

    function refreshToken() {
        return createAsyncThunk(`${name}/refreshToken`, async (_, { getState, dispatch }) => {
            try {
                const { Data: { UserDetails: { jwToken } } } = getState().auth.value;
                const response = await fetchWrapper.post(`${baseUrl}/refreshToken`, { jwToken });
                // set auth user in redux state

                const updatedAuthValue = {
                    ...getState().auth.value,
                    Data: {
                        ...getState().auth.value.Data,
                        UserDetails: {
                            ...getState().auth?.value?.Data?.UserDetails,
                            jwToken: response.token,
                            tokenExpiry: response.tokenExpiry
                        }
                    }
                    // ,
                    // token: response.token,
                    // tokenExpiry: response.tokenExpiry
                };

                dispatch(authActions.setAuth(updatedAuthValue));
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('auth', JSON.stringify(updatedAuthValue));
            } catch (error) {
                dispatch(alertActions.error({ message: error, header: "Login Issue", showAfterRedirect: true }));
            }

        });
    }

    function forgotPasswordRequest() {
        return createAsyncThunk(
            `${name}/forgotPasswordRequest`,
            async ({ email }, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/forgot-password`);
                    url.searchParams.append('EmailAddress', email);
                    const response = await trackPromise(fetchWrapper.post(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function resetPasswordRequest() {
        return createAsyncThunk(
            `${name}/resetPasswordRequest`,
            async ({ userId, newPassword }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/reset-password`, { UserId: userId, Password: newPassword }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function resetPasswordByUser() { 
        return createAsyncThunk(
            `${name}/resetPasswordbyUser`,
            async ({ userId, newPassword,currentPassword }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/ResetPasswordbyUser`, { UserId: userId, NewPassword: newPassword,CurrentPassword:currentPassword }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function userPasswordVerification() {  
        return createAsyncThunk(
            `${name}/userPasswordVerification`,
            async ({ userId, newPassword,currentPassword }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/UserPasswordVerification`, { UserId: userId, NewPassword: newPassword,CurrentPassword:currentPassword }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function generateOtp() {
        return createAsyncThunk(
            `${name}/generateOtp`,
            async ({ email }, { rejectWithValue }) => {
                try {
                    // const url = new URL(`${baseUrl}/GenerateOtp/${email}`);
                    // url.searchParams.append('EmailAddress', email);
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GenerateOtp/${email}`));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function validateOtp() {
        return createAsyncThunk(
            `${name}/validateOtp`,
            async ({ email, otp }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/ValidateOtp`, { EmailAddress: email, OTP: otp }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
}
