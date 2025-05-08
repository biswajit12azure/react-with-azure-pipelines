import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'userProfile';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const userProfileAction = { ...slice.actions, ...extraActions };
export const userProfileReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        userProfileData: null,
        filteredUserProfileData: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        getUserProfile: getUserProfile(),
        update: update(),
        delete: _delete(),
        verifyUser:verifyUser(),
        rejectUser: rejectUser(),
        filter: filter(),
        lockProfile:lockProfile()       
    };

    function getUserProfile() {
        return createAsyncThunk(
            `${name}/getUserProfile`,
            async (portalId, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetUserProfileByPortalID/${portalId}`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                   // const data = transformedData[0];
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/AssignRoleToUser`,{RoleAssignments: transformedData}));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function verifyUser() { 
        return createAsyncThunk( 
            `${name}/verifyUser`,
            async ( transformedData , { rejectWithValue }) => { 
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/MapCenterUserUpdateBySecurityReviewer`, transformedData ));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
    // /api/Account/UpdateRejectionReasonBySecurity
    function rejectUser() { 
        return createAsyncThunk(
            `${name}/rejectUser`,
            async ( transformedData , { rejectWithValue }) => { 
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateRejectionReasonBySecurity`, {rejectionDetails:transformedData} ));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function filter() {
        return createAsyncThunk(
            `${name}/filter`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetUserProfileBySearch`);
                    if (!data.PortalId) {
                        return 'PortalID is mandatory';
                    } else {
                        url.searchParams.append('PortalID', data.PortalId);
                        if (data.email) {
                            url.searchParams.append('EmailID', data.email);
                        }

                        // Conditionally append FullName if provided
                        if (data.fullName) {
                            url.searchParams.append('FullName', data.fullName);
                        }
                    }
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
    function _delete() {
        return createAsyncThunk( 
            `${name}/_delete`,
            async ( transformedData , { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/DeleteUserByID`,{userDeleteRequestParms: transformedData} ));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function lockProfile() { 
        return createAsyncThunk(
            `${name}/lockProfile`,
            async ( transformedData , { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateUnlockProfile`,{profile:  transformedData} ));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
}




function createReducers() {
    return {
        clear
    };

    function clear(state) {
        state.userProfileData = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getUserProfile();
        filter();
        function getUserProfile() {
            var { pending, fulfilled, rejected } = extraActions.getUserProfile;
            builder
                .addCase(pending, (state) => {
                    state.userProfileData = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.userProfileData = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.userProfileData = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredUserProfileData = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredUserProfileData = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredUserProfileData = { error: action.error };
                });
        }
    };
}