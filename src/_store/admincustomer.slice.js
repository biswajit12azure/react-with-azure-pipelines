import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'admincutomer';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const customerAction = { ...slice.actions, ...extraActions };
export const customerReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        getCustomerDetails: null,
        
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;
 
    return {
        getCustomerDetails: getCustomerDetails(),
        updateCustomerDetails:updateCustomerDetails()
    };

    function getCustomerDetails() {
        return createAsyncThunk(
            `${name}/getCustomerDetails`,
            async (accNumber, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetMarketerAssociation`);
                    url.searchParams.append('accountNumber', accNumber);
                    console.log(url);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }
  
    function updateCustomerDetails() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                   // const data = transformedData[0];
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateMarketerAssociation`,transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error.message);
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
        state.getCustomerDetails = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getCustomerDetails();
        function getCustomerDetails() {
            var { pending, fulfilled, rejected } = extraActions.getCustomerDetails;
            builder
                .addCase(pending, (state) => {
                    state.getCustomerDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.getCustomerDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.getCustomerDetails = { error: action.error };
                });
        }

    };
}