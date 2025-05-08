import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'activityInterruptible';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const activityInterruptibleAction = { ...slice.actions, ...extraActions };
export const activityInterruptibleReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        activityInterruptibleList: null,
        filteredActivityInterruptibleList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;

    return {
        get: get(),
        filter: filter(),
        insert: insert(),
        update: update(),
        deactivate: deactivate(),
    };

    function get() {
        return createAsyncThunk(
            `${name}/getActivityInterruptible`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetAdjustmentActivityInterruptibleReport`);
                    const response = await trackPromise(fetchWrapper.post(url.toString(),{Data:data}));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function filter() {
        return createAsyncThunk(
            `${name}/filter`,
            async (data, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/FilterActivityInterruptible`, data));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function insert() {
        return createAsyncThunk(
            `${name}/insert`,
            async (transformedData , { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreateActivityInterruptibleMaster`, transformedData));
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
            async (transformedData , { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/BulkUpdateActivityInterruptibles`, transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deactivate() {
        return createAsyncThunk(
            `${name}/deactivate`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/ActivateActivityInterruptibles`, transformedData));
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
        state.activityInterruptibleList = null;
        state.filteredActivityInterruptibleList = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();
        filter();

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.activityInterruptibleList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.activityInterruptibleList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.activityInterruptibleList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredActivityInterruptibleList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredActivityInterruptibleList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredActivityInterruptibleList = { error: action.error };
                });
        }
    };
}