import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'master';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const masterActions = { ...slice.actions, ...extraActions };
export const masterReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        portalData: [],
        document: null,
        supportDetails: null
    }
}

function createExtraActions() {
    // const baseUrl = `${process.env.REACT_APP_API_URL}/master`;
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Master`;

    return {
        getPortalData: getPortalData(),
        getNondisclosureDocument: getNondisclosureDocument(),
        saveRole:saveRole()
    };

    function getPortalData() {
        return createAsyncThunk(
            `${name}/getPortalData`,
            async (_, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.get(`${baseUrl}/GetPortalDetails`));
                    return response;
                }
                catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function getNondisclosureDocument() {
        return createAsyncThunk(
            `${name}/getNondisclosureDocument`,
            async (_, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.get(`${baseUrl}/download`));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

     function saveRole() { 
            return createAsyncThunk(
                `${name}/saveRole`,
                async ({data}, { rejectWithValue }) => {
                    try {
                        const response = await trackPromise(fetchWrapper.post(`${baseUrl}/CreateRole`,{Data: data}));
                        return response;
                    }
                    catch (error) {
                        return rejectWithValue(error);
                    }
                }
            );
        }
}

function createExtraReducers() {
    return (builder) => {
        getPortalData();
        getNondisclosureDocument();

        function getPortalData() {
            var { pending, fulfilled, rejected } = extraActions.getPortalData;
            builder
                .addCase(pending, (state) => {
                    state.portalData = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const result = action.payload;
                    state.portalData = result?.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.portalData = { error: action.error };
                });
        };

        function getNondisclosureDocument() {
            var { pending, fulfilled, rejected } = extraActions.getNondisclosureDocument;
            builder
                .addCase(pending, (state) => {
                    state.document = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.document = action.payload;
                })
                .addCase(rejected, (state, action) => {
                    state.document = { error: action.error };
                });
        };

    };
}