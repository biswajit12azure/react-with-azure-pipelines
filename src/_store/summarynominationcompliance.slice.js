import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

const name = 'compliancereport';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const complianceReportActions = { ...slice.actions, ...extraActions };
export const complianceReportReducer = slice.reducer;

// Initial state
function createInitialState() {
    return {
        complianceReportData: null,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    return {
        getComplianceReport: getComplianceReport()
    };

    function getComplianceReport() {
        return createAsyncThunk(
            `${name}/getComplianceReport`,
            async (transformObject, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(
                        fetchWrapper.post(`${baseUrl}/GetSummaryNominationComplianceReport`, transformObject)
                    );
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
        clearComplianceReportData: clearComplianceReportData
    };

    function clearComplianceReportData(state) {
        state.complianceReportData = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getComplianceReport();
        function getComplianceReport() {
            const { pending, fulfilled, rejected } = extraActions.getComplianceReport;
            builder
                .addCase(pending, (state) => {
                    state.complianceReportData = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.complianceReportData = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.complianceReportData = { error: action.error };
                });
        }
    };
}
