import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'configs';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const configAction = { ...slice.actions, ...extraActions };
export const configReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        portalAccessGetData: {},
        portalAccessPostData: []
    }
}

function createExtraActions() {
    // const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/UserPortalRoleMapping`;

    return {
        getAccess: getAccess(),
        postAccess: postAccess()
    };


    function getAccess() {
        return createAsyncThunk(
            `${name}/getAccessData`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetUserPortalRoleMapping`);
                    url.searchParams.append('PortalID', data);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));

                    return response;
                }
                catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function postAccess() {
        return createAsyncThunk(
            `${name}/postAccessData`,
            async (data, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}`, data));
                    return response;
                }
                catch (error) {
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
        state.portalAccessPostData = [];
    }
}

function createExtraReducers() {
    return (builder) => {
        getAccess();

        function getAccess() {
            var { pending, fulfilled, rejected } = extraActions.getAccess;
            builder
                .addCase(pending, (state) => {
                    state.portalAccessGetData = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.portalAccessGetData = action.payload;
                })
                .addCase(rejected, (state, action) => {
                    state.portalAccessGetData = { error: action.error };
                });
        }
    };
}