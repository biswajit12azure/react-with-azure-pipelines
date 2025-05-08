import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'supports';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const supportActions = { ...slice.actions, ...extraActions };
export const supportReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        supportDetails: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        getSupportDetails: getSupportDetails(),
        updateSupportDetails: updateSupportDetails()
    };

    function getSupportDetails() { 
        return createAsyncThunk(
            `${name}/getSupportDetails`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetSupportByID/${id}`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function updateSupportDetails() { 
        return createAsyncThunk(
            `${name}/updateSupportDetails`,
            async ({ data }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateSupport`, { Data: data }));
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
        getSupportDetails();

        function getSupportDetails() {
            var { pending, fulfilled, rejected } = extraActions.getSupportDetails;
            builder
                .addCase(pending, (state) => {
                    state.supportDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.supportDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.supportDetails = { error: action.error };
                });
        }
    };
}