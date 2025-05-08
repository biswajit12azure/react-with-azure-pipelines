import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// Create slice

const name = 'fileHubList';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// Exports

export const fileHubListActions = { ...slice.actions, ...extraActions }; // Export actions
export const fileHubListReducer = slice.reducer; // Export reducer

function createInitialState() {
    return {
        fileHubList: null,
        loading: false,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/UET`;

    return {
        getFileHubList: getFileHubList()
    };

    // Action to fetch file hub list
    function getFileHubList() {
        return createAsyncThunk(
            `${name}/getFileHubList`,
            async (_, { rejectWithValue }) => {
                try {
                    const url = `${baseUrl}/GetFileHub`;
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
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
        state.fileHubList = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        // Get File Hub List action handling
        const { pending, fulfilled, rejected } = extraActions.getFileHubList;
        builder
            .addCase(pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fulfilled, (state, action) => {
                state.fileHubList = action.payload.Data;
                state.loading = false;
            })
            .addCase(rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    };
}
