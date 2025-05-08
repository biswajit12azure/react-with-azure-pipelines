import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'firm';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const firmAction = { ...slice.actions, ...extraActions };
export const firmReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        firmList: null
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
            `${name}/getFirm`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetSummaryAdjustmentActivity`);
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
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateSummaryAdjustmentActivity`, transformedData));
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
        state.firmList = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.firmList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.firmList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.firmList = { error: action.error };
                });
        }
    };
}