import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

const name = 'forecastReport';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const forecastReportActions = { ...slice.actions, ...extraActions };
export const forecastReportReducer = slice.reducer;

// Initial state
function createInitialState() {
    return {
        forecastData: null,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    return {
        getForecastReport: getForecastReport()
    };

    function getForecastReport() {
        return createAsyncThunk(
            `${name}/getForecastReport`,
            async (requestParams, { rejectWithValue }) => {
                try {
                    // Sending request to the GetFiveDayRequirementForecastReport API
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GetFiveDayRequirementForecastReport`, requestParams));
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
        clearForecastData: clearForecastData
    };

    function clearForecastData(state) {
        state.forecastData = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        const { pending, fulfilled, rejected } = extraActions.getForecastReport;
        builder
            .addCase(pending, (state) => {
                state.forecastData = { loading: true };
            })
            .addCase(fulfilled, (state, action) => {
                state.forecastData = action.payload.Data;
            })
            .addCase(rejected, (state, action) => {
                state.forecastData = { error: action.error };
            });
    };
}
