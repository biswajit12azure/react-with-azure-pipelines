import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'interruptible';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const interruptibleAction = { ...slice.actions, ...extraActions };
export const interruptibleReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        interruptibleList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`; 

    return {
        get: get(),
        update: update()
    };

    function get() { 
        return createAsyncThunk(
            `${name}/getinterruptible`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetSummaryAdjustmentInterupptibleActivity`);
                    const response = await trackPromise(fetchWrapper.post(url.toString(), { Data: transformedData }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateSummaryAdjustmentActivityInterruptible`, transformedData));
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
        state.interruptibleList = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.interruptibleList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.interruptibleList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.interruptibleList = { error: action.error };
                });
        }
    };
}