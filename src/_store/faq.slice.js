import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'faq';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const faqAction = { ...slice.actions, ...extraActions };
export const faqReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        faqList: null,
        faqListByAdmin: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/FAQ`;

    return {
        get: get(),
        getByAdminRole:getByAdminRole(),
        getById:getById(),
        insert: insert(),
        update: update(),
        deleteFaq:deleteFaq(),       
    };

    function get() {
        return createAsyncThunk( 
            `${name}/getFaqs`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetAllFAQ`);
                    url.searchParams.append('userID', id);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function getByAdminRole() {
        return createAsyncThunk( 
            `${name}/getByAdminRole`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetFAQByAdminRole`);
                    url.searchParams.append('userID', id);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function getById() { 
        return createAsyncThunk( 
            `${name}/getFaqsByID`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetFAQByPortalID`);
                    url.searchParams.append('portalID', id);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
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
            async ({transformedData }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/Create-FAQ`, { Data: transformedData }));
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
            async ({ transformedData }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateFAQ`, { Data: transformedData }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deleteFaq() { 
        return createAsyncThunk( 
            `${name}/deleteFaq`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/Delete-FAQ`);
                    url.searchParams.append('faqID', id);
                    const response = await trackPromise(fetchWrapper.delete(url.toString()));
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
        state.faqList = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();
        getByAdminRole();
        getById();

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.faqList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.faqList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.faqList = { error: action.error };
                });
        }

        function getByAdminRole() {
            var { pending, fulfilled, rejected } = extraActions.getByAdminRole;
            builder
                .addCase(pending, (state) => {
                    state.faqListByAdmin = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.faqListByAdmin = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.faqListByAdmin = { error: action.error };
                });
        }

        function getById() {
            var { pending, fulfilled, rejected } = extraActions.getById;
            builder
                .addCase(pending, (state) => {
                    state.faqList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.faqList = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.faqList = { error: action.error };
                });
        }
    };
}