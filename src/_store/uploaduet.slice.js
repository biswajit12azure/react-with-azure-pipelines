import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
// import { alertActions } from '_store';
import { fetchWrapper } from '_utils';

// Create slice

const name = 'uploadUet';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers });

// Exports

export const uploadUetActions = { ...slice.actions, ...extraActions };
export const uploadUetReducer = slice.reducer;

// Implementation

function createInitialState() {
    return {
        fileData: null,
        uploadStatus: null,
        errorMessage: null,
        isUploading: false
    };
}

function createReducers() {
    return {
        setUploadStatus,
        clearUpload
    };

    function setUploadStatus(state, action) {
        state.uploadStatus = action.payload.status;
        state.fileData = action.payload.data;
        state.isUploading = false;
        state.errorMessage = null;
    }

    function clearUpload(state) {
        state.fileData = null;
        state.uploadStatus = null;
        state.isUploading = false;
        state.errorMessage = null;
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/UET`;

    return {
        uploadUet: uploadUet()
    };

    function uploadUet() {
        return createAsyncThunk(
            `${name}/uploadUet`, async (payload, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/UploadUet`, payload));
                    return response;
                }  catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
}
