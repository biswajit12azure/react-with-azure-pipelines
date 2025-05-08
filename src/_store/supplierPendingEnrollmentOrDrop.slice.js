import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'supplierPendingEnrollmentOrDrop';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const supplierPendingEnrollmentOrDropAction = { ...slice.actions, ...extraActions };
export const supplierPendingEnrollmentOrDropReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        supplierPendingEnrollmentOrDropList: null,
        filteredSupplierPendingEnrollmentOrDropList: null
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
            `${name}/getSupplierPendingEnrollmentOrDrop`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetSupplierPendingEnrollmentAndDrop`);
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/FilterSupplierPendingEnrollmentOrDrop`, data));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreateSupplierPendingEnrollmentOrDropMaster`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/BulkUpdateSupplierPendingEnrollmentOrDrops`, transformedData));
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
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/ActivateSupplierPendingEnrollmentOrDrops`, transformedData));
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
        state.supplierPendingEnrollmentOrDropList = null;
        state.filteredSupplierPendingEnrollmentOrDropList = null;
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
                    state.supplierPendingEnrollmentOrDropList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.supplierPendingEnrollmentOrDropList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.supplierPendingEnrollmentOrDropList = { error: action.error };
                });
        }

        function filter() {
            var { pending, fulfilled, rejected } = extraActions.filter;
            builder
                .addCase(pending, (state) => {
                    state.filteredSupplierPendingEnrollmentOrDropList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.filteredSupplierPendingEnrollmentOrDropList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.filteredSupplierPendingEnrollmentOrDropList = { error: action.error };
                });
        }
    };
}