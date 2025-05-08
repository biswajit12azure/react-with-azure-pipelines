import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'marketercustomer';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const marketerBillingHistoryAction = { ...slice.actions, ...extraActions };
export const marketerBillingHistoryReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        getMarketerBillingHistory: null,
        
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
 
    return {
        getMarketerBillingHistory: getMarketerBillingHistory(),
    };

    function getMarketerBillingHistory() {
        return createAsyncThunk(
            `${name}/getMarketerBillingHistory`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetMarketerBillingHistory`);
                    // url.searchParams.append('AccountNumber', );
                    console.log(url);
                    const response = await trackPromise(fetchWrapper.post(url.toString(),{Data:data}));
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
        state.getMarketerBillingHistory = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getMarketerBillingHistory();
        function getMarketerBillingHistory() {
            var { pending, fulfilled, rejected } = extraActions.getMarketerBillingHistory;
            builder
                .addCase(pending, (state) => {
                    state.getMarketerBillingHistory = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.getMarketerBillingHistory = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.getMarketerBillingHistory = { error: action.error };
                });
        }

    };
}