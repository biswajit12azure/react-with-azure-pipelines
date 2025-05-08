import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

const name = 'summaryStorageMarketerReport';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const summaryStorageMarketerReportActions = { ...slice.actions, ...extraActions };
export const summaryStorageMarketerReportReducer = slice.reducer;

// Initial state
function createInitialState() {
    return {
        summaryStorageData: null,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    return {
        getSummaryStorageMarketerReport: getSummaryStorageMarketerReport()
    };

    function getSummaryStorageMarketerReport() {
        return createAsyncThunk(
            `${name}/getSummaryStorageMarketerReport`,
            async (requestParams, { rejectWithValue }) => {
                try {
                    // Sending request to the GetSummaryStorageMarketerReport API
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GetSummaryStorageMarketerReport`, requestParams));
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
        clearSummaryStorageData: clearSummaryStorageData
    };

    function clearSummaryStorageData(state) {
        state.summaryStorageData = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        const { pending, fulfilled, rejected } = extraActions.getSummaryStorageMarketerReport;
        builder
            .addCase(pending, (state) => {
                state.summaryStorageData = { loading: true };
            })
            .addCase(fulfilled, (state, action) => {
                state.summaryStorageData = action.payload.Data;
            })
            .addCase(rejected, (state, action) => {
                state.summaryStorageData = { error: action.error };
            });
    };
}
