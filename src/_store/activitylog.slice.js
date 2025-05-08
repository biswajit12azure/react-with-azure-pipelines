import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'activityLog';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const activityLogAction = { ...slice.actions, ...extraActions };
export const activityLogReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        activityLogList: null,
        filteredActivityLogList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        get: get(),
        filter: filter(),
        insert:insert()
    };

    function get() {
        return createAsyncThunk(
            `${name}/getActivityLog`,
            async (portalId, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetActivityByPortalId/${portalId}`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/ActivityBySearch`, data));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function insert() { 
        return createAsyncThunk(
            `${name}/insert`,
            async (data, { rejectWithValue }) => {  
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreateActivityLogs`,{activityLogsDetails:data}));
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
        state.activityLogList = null;
        state.filteredActivityLogList = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();
        filter()

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.activityLogList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.activityLogList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.activityLogList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredActivityLogList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredActivityLogList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredActivityLogList = { error: action.error };
                });
        }
    };
}