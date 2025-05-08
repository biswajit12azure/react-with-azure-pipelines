import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// Create slice for adding fuel charges (which updates existing entries)

const name = 'fuelcharge';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// Exports
export const fuelChargeActions = { ...slice.actions, ...extraActions };
export const fuelChargeReducer = slice.reducer;

// Implementation

function createInitialState() {
    return {
        fuelChargeList: null,
        fuelChargeDetails: null,
        error: null
    };
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;

    return {
        updateFuelCharge: updateFuelCharge(),
        getFuelCharge: getFuelCharge(),
        deleteFuelCharge: deleteFuelCharge(),
    };

    function updateFuelCharge() {
        return createAsyncThunk(
            `${name}/updateFuelCharge`,
            async (fuelChargeData, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/AddFuelCharge`, fuelChargeData)); 
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function getFuelCharge() {
        return createAsyncThunk(
            `${name}/getFuelCharge`,
            async (_, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/AddFuelCharge`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deleteFuelCharge() {
        return createAsyncThunk(
            `${name}/deleteFuelCharge`,
            async (fuelChargeId, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/DeleteFuelCharge`, { data: { id: fuelChargeId } }));
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
        clearFuelCharge: clearFuelCharge
    };

    function clearFuelCharge(state) {
        state.fuelChargeList = null;
        state.fuelChargeDetails = null;
        state.error = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        // Handling updateFuelCharge
        var { pending, fulfilled, rejected } = extraActions.updateFuelCharge;
        builder
            .addCase(pending, (state) => {
                state.fuelChargeDetails = { loading: true };
            })
            .addCase(fulfilled, (state, action) => {
                state.fuelChargeDetails = action.payload.Data; // Assuming response has updated data
            })
            .addCase(rejected, (state, action) => {
                state.fuelChargeDetails = { error: action.error };
            });

        // Handling getFuelCharge
        var { pending: getPending, fulfilled: getFulfilled, rejected: getRejected } = extraActions.getFuelCharge;
        builder
            .addCase(getPending, (state) => {
                state.fuelChargeDetails = { loading: true };
            })
            .addCase(getFulfilled, (state, action) => {
                state.fuelChargeDetails = action.payload.Data;
            })
            .addCase(getRejected, (state, action) => {
                state.fuelChargeDetails = { error: action.error };
            });

        // Handling deleteFuelCharge
        var { pending: deletePending, fulfilled: deleteFulfilled, rejected: deleteRejected } = extraActions.deleteFuelCharge;
        builder
            .addCase(deletePending, (state) => {
                state.fuelChargeList = { loading: true };
            })
            .addCase(deleteFulfilled, (state, action) => {
                // Assuming the deletion returns a list of remaining fuel charges
                state.fuelChargeList = action.payload.Data;
            })
            .addCase(deleteRejected, (state, action) => {
                state.fuelChargeList = { error: action.error };
            });
    };
}
