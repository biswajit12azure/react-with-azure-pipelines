import { createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'marketergroup';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const marketergroupAction = { ...slice.actions, ...extraActions };
export const marketergroupReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        marketerGroupList: null,
        filteredMarketerGroupList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/MarketerGroup`;

    return {
        get: get(),
        filter: filter(),
        insert: insert(),
        update: update(),
        updateBalancingModel:updateBalancingModel(),
        deleteGroupById: deleteGroupById(),
        bulkDelete:bulkDelete()
    };

    function get() {
        return createAsyncThunk(
            `${name}/getmarketergroup`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetMarketersGroupByMarketerID/${id}`);
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GetMarketersGroupSearch`, data));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreateMarketerGroup`,{Data: transformedData}));
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
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateMarketerGroup`, transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function updateBalancingModel() { 
        return createAsyncThunk(
            `${name}/updateBalancingModel`,
            async (transformedData , { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateBalancingModelHistory`, transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deleteGroupById() {
        return createAsyncThunk( 
            `${name}/deleteGroupById`,
            async (id, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/DeleteMarketerGroup/${id}`));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function bulkDelete() { 
        return createAsyncThunk( 
            `${name}/bulkDelete`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/Delete-AllMarketerGroup`, transformedData));
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
                    state.marketerGroupList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.marketerGroupList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.marketerGroupList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredMarketerGroupList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredMarketerGroupList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredMarketerGroupList = { error: action.error };
                });
        }
    };
}