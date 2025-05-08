import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// Create slice

const name = 'fileSubType'; // Changed from 'nomination' to 'fileSubType'
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// Exports

export const fileSubTypeAction = { ...slice.actions, ...extraActions }; // Changed from nominationsAction to FileSubTypeAction
export const fileSubTypeReducer = slice.reducer; // Changed from nominationReducer to FileSubTypeReducer

// Implementation

function createInitialState() {
    return {
        supplierMessages: null, // Store the supplier messages
        loading: false,
        error: null
    };
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/UET`;

    return {
        getSupplierMessages: getSupplierMessages()
    };

    // Action to fetch supplier messages using the marketid
    function getSupplierMessages() {
        return createAsyncThunk(
            `${name}/getSupplierMessages`,
            async (marketid, { rejectWithValue }) => {
                try {
                    // Create the dynamic URL with the marketid
                    const url = `${baseUrl}/GetSupplierMessages/${marketid}`;
                    const response = await trackPromise(fetchWrapper.get(url));
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
        state.supplierMessages = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        // Get Supplier Messages action handling
        var { pending, fulfilled, rejected } = extraActions.getSupplierMessages;
        builder
            .addCase(pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fulfilled, (state, action) => {
                state.supplierMessages = action.payload.Data; // Save the data into state
                state.loading = false;
            })
            .addCase(rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    };
}
