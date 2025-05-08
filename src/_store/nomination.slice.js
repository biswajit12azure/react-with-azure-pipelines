import { createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'nomination';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const nominationsAction = { ...slice.actions, ...extraActions };
export const nominationReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        deliveryGuide: null,
        deliveryMatrix: null
    }
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        getDeliveryMatrix: getDeliveryMatrix(),
    };

    function getDeliveryMatrix() {
        return createAsyncThunk(
            `${name}/getDeliveryMatrix`,
            async (portalId, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetUserProfileByPortalID/${portalId}`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
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
        state.deliveryMatrix = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getDeliveryMatrix();
        function getDeliveryMatrix() {
            var { pending, fulfilled, rejected } = extraActions.getUserProfile;
            builder
                .addCase(pending, (state) => {
                    state.deliveryMatrix = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.deliveryMatrix = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.deliveryMatrix = { error: action.error };
                });
        }

    };
}