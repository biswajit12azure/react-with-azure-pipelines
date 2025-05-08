
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

const name = 'announcementFilter';
const initialState = {
    announcementList: null,
    announcementById: null,
};

const baseUrl = `${process.env.REACT_APP_API_URL}/api/Announcement`;

const extraActions = {
    getAnnouncements: createAsyncThunk(
        `${name}/getAnnouncements`,
        async (params, { rejectWithValue }) => {
            try {
                const response = await trackPromise(
                    fetchWrapper.post(`${baseUrl}/SearchAnnouncement`, { Data: params })
                );
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        }
    ),
    getAnnouncementById: createAsyncThunk(
        `${name}/getAnnouncementById`,
        async ({ PortalID, RoleIds }, { rejectWithValue }) => {
            try {
                const response = await trackPromise(
                    fetchWrapper.post(`${baseUrl}/SearchAnnouncement`, { 
                        Data: { PortalID, RoleIds }
                    })
                );
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        }
    ),
    
};

const slice = createSlice({
    name,
    initialState,
    reducers: {
        clearAnnouncement: (state) => {
            state.announcementList = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(extraActions.getAnnouncements.pending, (state) => {
                state.announcementList = { loading: true };
            })
            .addCase(extraActions.getAnnouncements.fulfilled, (state, action) => {
                state.announcementList = action.payload.Data;
            })
            .addCase(extraActions.getAnnouncements.rejected, (state, action) => {
                state.announcementList = { error: action.error };
            })
            .addCase(extraActions.getAnnouncementById.pending, (state) => {
                state.announcementById = { loading: true };
            })
            .addCase(extraActions.getAnnouncementById.fulfilled, (state, action) => {
                state.announcementById = action.payload.Data;
            })
            .addCase(extraActions.getAnnouncementById.rejected, (state, action) => {
                state.announcementById = { error: action.error };
            });
    },
});

export const { clearAnnouncement } = slice.actions;
export const announcementFilterReducer = slice.reducer;
export const announcementFilterActions = extraActions;
