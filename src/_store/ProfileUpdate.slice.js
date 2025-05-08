import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'profileupdate';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const myprofileAction = { ...slice.actions, ...extraActions };
export const myprofileReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        individualDetails: null,
        individualMCDetails:null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;
    

    return {
        getUserDetails: getUserDetails(),
        updateProfile:updateProfile(),
        getMCUserDetails:getMCUserDetails(),
        updateMCProfile:updateMCProfile()
    };

    function getUserDetails() {
        return createAsyncThunk(
            `${name}/getuserDetails`,
            async (userId, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetBasicUserDetailsByID/${userId}`);
                    console.log("url",url.toString());
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function updateProfile() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const payload = {
                        "updateUserBasicDetails": transformedData, // Wrapping the object correctly
                      };
                      console.log(payload);
                   // const data = transformedData[0];
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateUserBasicDetails`,payload));
                    return response;
                } catch (error) {
                    return rejectWithValue(error.message);
                }
            }
        );
    }

    function getMCUserDetails() {
        return createAsyncThunk(
            `${name}/getMCuserDetails`,
            async (userId, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetRegisterMapCentreAsync/${userId}`);
                    console.log("url",url.toString());
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function updateMCProfile() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    // const payload = {
                    //     "Data": transformedData, // Wrapping the object correctly
                    //   };
                    //   console.log(payload);
                   // const data = transformedData[0];
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdatePersonalInfo-MC`,{Data : transformedData}));
                    return response;
                } catch (error) {
                    return rejectWithValue(error.message);
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
        state.individualDetails = null;
        state.individualMCDetails = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getUserDetails()
        getMCUserDetails()
        function getUserDetails() {
            var { pending, fulfilled, rejected } = extraActions.getUserDetails;
            builder
                .addCase(pending, (state) => {
                    state.individualDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.individualDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.individualDetails = { error: action.error };
                });
        }
        function getMCUserDetails() {
            var { pending, fulfilled, rejected } = extraActions.getMCUserDetails;
            builder
                .addCase(pending, (state) => {
                    state.individualMCDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.individualMCDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.individualMCDetails = { error: action.error };
                });
        }

    };
}