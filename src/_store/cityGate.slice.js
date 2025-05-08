import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'cityGate';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const cityGateAction = { ...slice.actions, ...extraActions };
export const cityGateReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        cityGateList: null,
        filteredCityGateList: null
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
            `${name}/getCityGate`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetSummarySupplyByCityGateReport`);
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/FilterCityGate`, data));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreateCityGateMaster`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/BulkUpdateCityGates`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/ActivateCityGates`, transformedData));
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
        state.cityGateList = null;
        state.filteredCityGateList = null;
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
                    state.cityGateList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.cityGateList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.cityGateList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredCityGateList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredCityGateList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredCityGateList = { error: action.error };
                });
        }
    };
}