import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'nominationgroup';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const nominationgroupAction = { ...slice.actions, ...extraActions };
export const nominationgroupReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        nominationGroupList: null,
        filteredNominationGroupList: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    
   // const baseUrl = 'https:/localhost:7017/api/Marketer';

    return {
        get: get(),
        filter: filter(),
        update: update()
    };
   
    function get() {
        return createAsyncThunk(
            `${name}/getmarketergroup`,
            async (_, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetGroupNominations`);
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/GroupNominationFilter`, data));
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
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateGroupNominations`, transformedData));
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
                    state.nominationGroupList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.nominationGroupList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.nominationGroupList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredNominationGroupList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredNominationGroupList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredNominationGroupList = { error: action.error };
                });
        }
    };
}