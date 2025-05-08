import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'reports';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const marketerReportAction = { ...slice.actions, ...extraActions };
export const marketerReportReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        CustomerUsageDetails: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;

    return {
        getCustomerUsageDetails: getCustomerUsageDetails(),
    };
 
    function getCustomerUsageDetails() { 
        return createAsyncThunk(
            `${name}/GetCustomerUsageReport`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GetCustomerUsageReport`, {Data:transformedData}));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getCustomerUsageDetails();

        function getCustomerUsageDetails() {
            var { pending, fulfilled, rejected } = extraActions.getCustomerUsageDetails;
            builder
                .addCase(pending, (state) => {
                    state.CustomerUsageDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.CustomerUsageDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.CustomerUsageDetails = { error: action.error };
                });
        }
    };
}