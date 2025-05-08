import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'pipelineConfirmation';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const pipelineConfirmationAction = { ...slice.actions, ...extraActions };
export const pipelineConfirmationReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        pipelineConfirmationList: null,
        filteredPipelineConfirmationList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Reports`;

    return {
        get: get(),
        filter: filter(),
        insert: insert(),
        update: update(),
        deactivate: deactivate(),
    };

    function get() {
        return createAsyncThunk(
            `${name}/getPipelineConfirmation`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/PipelinConfirmationReport`);
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/FilterPipelineConfirmation`, data));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreatePipelineConfirmationMaster`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/BulkUpdatePipelineConfirmations`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/ActivatePipelineConfirmations`, transformedData));
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
        state.pipelineConfirmationList = null;
        state.filteredPipelineConfirmationList = null;
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
                    state.pipelineConfirmationList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.pipelineConfirmationList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.pipelineConfirmationList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredPipelineConfirmationList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredPipelineConfirmationList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredPipelineConfirmationList = { error: action.error };
                });
        }
    };
}