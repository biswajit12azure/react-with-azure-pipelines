import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'filehub';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const filehubAction = { ...slice.actions, ...extraActions };
export const filehubReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        filehub: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Master`;
    const baseUrl1 = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
    
   // const baseUrl = 'https:/localhost:7017/api/Marketer';

    return {
        get: get(),
        update: update()
    };

    function get() {
        return createAsyncThunk(
            `${name}/filehub`,
            async (transformedData, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/download`);
                    console.log("shdgsadgsd",transformedData)
                    const response = await trackPromise(fetchWrapper.post(url.toString(),transformedData));
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
                    console.log(transformedData);
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl1}/upload`, transformedData));
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
        state.filehub = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.filehub = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filehub = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filehub = { error: action.error };
                });
        }
    };
}