import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'nominationpipeline';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const nominationpipelineAction = { ...slice.actions, ...extraActions };
export const nominationpipelineReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        nominationPipelineList: null,
        filteredNominationPipelineList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    
   // const baseUrl = 'https:/localhost:7017/api/Marketer';

    return {
        get: get(),
        filter: filter(),
        insert: insert(),
        update: update(),
        delete:_delete()
    };

    function get() {
        return createAsyncThunk(
            `${name}/getmarketergroup`,
            async (_, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/nomination`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/nominationFilter`, data));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/AddPipelineContracts`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/ChangePipelineNominationQuantity`, transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function _delete() { 
        return createAsyncThunk( 
            `${name}/_delete`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/DeletePipelineContracts`, transformedData));
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
        state.marketerGroupList = null;
        state.filteredMarketerGroupList = null;
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
                    state.nominationPipelineList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.nominationPipelineList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.nominationPipelineList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredNominationPipelineList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredNominationPipelineList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredNominationPipelineList = { error: action.error };
                });
        }
    };
}