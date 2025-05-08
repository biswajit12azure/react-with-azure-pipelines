import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

const name = 'supplierActiveCustomerReport';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const supplierActiveCustomerReportActions = { ...slice.actions, ...extraActions };
export const supplierActiveCustomerReportReducer = slice.reducer;

// Initial state
function createInitialState() {
    return {
        supplierCustomerData: null,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Reports`;
    return {
        getSupplierActiveCustomerReport: getSupplierActiveCustomerReport()
    };

    function getSupplierActiveCustomerReport() {
        return createAsyncThunk(
            `${name}/getSupplierActiveCustomerReport`,
            async (requestParams, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(
                        fetchWrapper.post(`${baseUrl}/SupplierActiveCustomerReport`,{supplierActiveCustomerRequest: requestParams})
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
        clearSupplierCustomerData: clearSupplierCustomerData
    };

    function clearSupplierCustomerData(state) {
        state.supplierCustomerData = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        const { pending, fulfilled, rejected } = extraActions.getSupplierActiveCustomerReport;
        builder
            .addCase(pending, (state) => {
                state.supplierCustomerData = { loading: true };
            })
            .addCase(fulfilled, (state, action) => {
                state.supplierCustomerData = action.payload.Data;
            })
            .addCase(rejected, (state, action) => {
                state.supplierCustomerData = { error: action.error };
            });
    };
}
