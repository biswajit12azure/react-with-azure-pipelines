import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { alertActions } from '_store';
import { history, fetchWrapper } from '_utils';
import msalInstance from 'authConfig';

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
        value: JSON.parse(localStorage.getItem('auth')),
        userId: localStorage.getItem('userId'),
        isAuthenticated: localStorage.getItem('isAuthenticated')
    }
}

function createReducers() {
    return {
        setAuth
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
}

function createExtraActions() {
    // const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        login: login(),
        logout: logout(),
        refreshToken: refreshToken(),
        forgotPasswordRequest: forgotPasswordRequest(),
        resetPasswordRequest: resetPasswordRequest(),
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
                    localStorage.setItem('auth', JSON.stringify(user));
                    if (user) {
                        const { Data: { UserDetails: { id } } } = user;
                        const { Succeeded } = user;

                        localStorage.setItem('isAuthenticated', Succeeded);
                        localStorage.setItem('userId', id);
                    }

                } catch (error) {
                    dispatch(alertActions.error({ message: error, header: "Login Failed" }));
                }
            }
        );
    }

    function logout() {
        return createAsyncThunk(
            `${name}/logout`, async (arg, { dispatch }) => {
                try {
                    //console.log(`${window.location.origin}/`);
                    const isInternalUser = JSON.parse(localStorage.getItem('isInternalUser'));
                    if (isInternalUser) {
                        await msalInstance.initialize();
                        await msalInstance.logoutPopup({
                            postLogoutRedirectUri: `${window.location.origin}/`,
                        });
                    }
                    dispatch(authActions.setAuth(null));
                    localStorage.removeItem('auth');
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('appMenuItems');
                    localStorage.removeItem('portalID');
                    localStorage.removeItem('isInternalUser');
                    history.navigate('/');
                } catch (error) {
                    dispatch(alertActions.error({ message: error, header: "Logout Failed" }));
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
                localStorage.setItem('auth', JSON.stringify(updatedAuthValue));
            } catch (error) {
                dispatch(alertActions.error({ message: error, header: "Login Issue" }));
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
