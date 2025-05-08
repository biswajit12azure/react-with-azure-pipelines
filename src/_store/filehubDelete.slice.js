import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// Create slice for file hub (for deleting files by FileHubID)

const name = 'filehubDelete';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// Exports
export const fileHubDeleteActions = { ...slice.actions, ...extraActions };
export const fileHubDeleteReducer = slice.reducer;

// Implementation

function createInitialState() {
    return {
        fileHubList: null, 
        fileHubDetails: null, 
        error: null,
        successMessage: null, 
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/UET`;

    return {
        deleteFileHub: deleteFileHub()
    };

    function deleteFileHub() {
        return createAsyncThunk(
            `${name}/deleteFileHub`,
            async (fileHubID, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/Delete/${fileHubID}`));
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
        clearFileHubDelete: clearFileHubDelete
    };

    function clearFileHubDelete(state) {
        state.fileHubList = null;
        state.fileHubDetails = null;
        state.error = null;
        state.successMessage = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        // Handling deleteFileHub
        var { pending, fulfilled, rejected } = extraActions.deleteFileHub;
        builder
            .addCase(pending, (state) => {
                state.fileHubList = { loading: true };
            })
            .addCase(fulfilled, (state, action) => {
                const { result } = action.payload;

                if (result.Succeeded) {
                    state.successMessage = result.Message; 
                } else {
                    state.error = result.Errors; 
                }
            })
            .addCase(rejected, (state, action) => {
                state.fileHubList = { error: action.error };
            });
    };
}
