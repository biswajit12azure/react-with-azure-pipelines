import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

const name = 'dnominationreport';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const dcnominationReportActions = { ...slice.actions, ...extraActions };
export const dcNominationReportReducer = slice.reducer;

// Initial state
function createInitialState() {
    return {
        dcNominationData: null,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    return {
        getDCNominationReport: getDCNominationReport()
    };

    function getDCNominationReport() {
        return createAsyncThunk(
            `${name}/getDCNominationReport`,
            async (transformObject, { rejectWithValue }) => {
                try {
                    // Sending request to the GetSummaryStorageMarketerReport API
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GetDCNominationReallocationReport`, {Data: transformObject}));
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
        clearDCNominationData: clearDCNominationData
    };

    function clearDCNominationData(state) {
        state.dcNominationData = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getDCNominationReport();
        function getDCNominationReport() {
            var { pending, fulfilled, rejected } = extraActions.getDCNominationReport;
            builder
                .addCase(pending, (state) => {
                    state.dcNominationData = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.dcNominationData = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.dcNominationData = { error: action.error };
                });
        }
    };
}
