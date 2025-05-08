import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'AlertAnnouncements';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const alertMessageActions = { ...slice.actions, ...extraActions };
export const alertMessageReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        alertMessageDetails: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Announcement`;

    return {
        getAlertMessageDetails: getAlertMessageDetails(),
       
    };

    function getAlertMessageDetails() {
        return createAsyncThunk(
            `${name}/getAlertMessageDetails`,
            async (data, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetPinnedIDAnnouncement`);
                    url.searchParams.append('roleId', data.roleId);
                    url.searchParams.append('portalId', data.portalID);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

}

function createExtraReducers() {
    return (builder) => {
        getAlertMessageDetails();

        function getAlertMessageDetails() {
            var { pending, fulfilled, rejected } = extraActions.getAlertMessageDetails;
            builder
                .addCase(pending, (state) => {
                    state.alertMessageDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.alertMessageDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.alertMessageDetails = { error: action.error };
                });
        }
    };
}