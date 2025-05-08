import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'announcement';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const announcementAction = { ...slice.actions, ...extraActions };
export const announcementReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        announcements: null,
        allAnnouncements: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Announcement`;

    return {
        get: get(),
        getAllAnnouncements:getAllAnnouncements(),
        insert: insert(),
        update: update(),
        deleteAnnouncement:deleteAnnouncement(),
        deleteAllAnnouncement:deleteAllAnnouncement(),
        pin:pin()
    };

    function get() {
        return createAsyncThunk(  
            `${name}/getAnnouncements`,
            async ({id, portalIds}, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetAnnouncementByID`);
                    if(id.toString() !== "0"){
                        url.searchParams.append('userID', id);
                    }
                    else{
                    url.searchParams.append('PortalIds', portalIds);
                    }
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function getAllAnnouncements() {
        return createAsyncThunk(  
            `${name}/getAllAnnouncements`,
            async ({id, portalIds}, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetAnnouncementByAllRole`);
                    if(id.toString() !== "0"){
                        url.searchParams.append('userID', id);
                    }
                    else{
                    url.searchParams.append('PortalIds', portalIds);
                    }
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
                    const response = await trackPromise(fetchWrapper.post(`${baseUrl}/Create-Announcement`,  transformedData ));
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
            async ({ id, transformedData }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdateAnnouncement`, transformedData ));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deleteAnnouncement() {
        return createAsyncThunk( 
            `${name}/deleteAnnouncement`,
            async (id, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/Delete-Announcement/${id}`));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deleteAllAnnouncement() { 
        return createAsyncThunk( 
            `${name}/deleteAllAnnouncement`,
            async (selectedAnnouncements, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.delete(`${baseUrl}/Delete-AllAnnouncement`,selectedAnnouncements));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function pin() {
        return createAsyncThunk(  
            `${name}/pin`,
            async ({transformedData}, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/IsPinned`, { isPinnedAnnouncement: transformedData }));
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
        state.announcements = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        get();
        getAllAnnouncements();

        function get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.announcements = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.announcements = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.announcements = { error: action.error };
                });
        }

        function getAllAnnouncements() {
            var { pending, fulfilled, rejected } = extraActions.getAllAnnouncements;
            builder
                .addCase(pending, (state) => {
                    state.allAnnouncements = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.allAnnouncements = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.allAnnouncements = { error: action.error };
                });
        }
    };
}