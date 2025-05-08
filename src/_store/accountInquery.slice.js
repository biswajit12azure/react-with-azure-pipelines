import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';


const name = 'accountInquiry';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });


export const accountInquiryActions = { ...slice.actions, ...extraActions };
export const accountInquiryReducer = slice.reducer;

// Initial state
function createInitialState() {
    return {
        inquiryDetails: null,
        error: null
    };
}


function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL_AccountInquery || 'https://wglhzus2desvas004.azurewebsites.net'}/api/AccountInquiry`;

    return {
        getInquiryDetails: getInquiryDetails()
    };

    function getInquiryDetails() {
        return createAsyncThunk(
            `${name}/getInquiryDetails`,
            async (requestParams, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/inquire`, requestParams)); 
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
        clearInquiryData: clearInquiryData
    };

    function clearInquiryData(state) {
        state.inquiryDetails = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        var { pending, fulfilled, rejected } = extraActions.getInquiryDetails;
        builder
            .addCase(pending, (state) => {
                state.inquiryDetails = { loading: true };
            })
            .addCase(fulfilled, (state, action) => {
                state.inquiryDetails = action.payload.Data;
            })
            .addCase(rejected, (state, action) => {
                state.inquiryDetails = { error: action.error };
            });
    };
}
