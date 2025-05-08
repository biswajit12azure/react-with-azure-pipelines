import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

    const baseUrl = `${process.env.REACT_APP_API_URL}/api/MarketerGroup`;
    const baseUrl1 = `${process.env.REACT_APP_API_URL}/api/VolumeLimitMessage`;


    return {
        getDeliveryMatrix: getDeliveryMatrix(),
        getDeliveryGuide: getDeliveryGuide(),
        updateGuide:updateGuide(),
        updateDeliveryMatrix:updateDeliveryMatrix(),
        updateGasVolume:updateGasVolume()
    };

    function getDeliveryMatrix() {
        return createAsyncThunk(
            `${name}/getDeliveryMatrix`,
            async (matrixid, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetDeliveryMatrix/`);
                    url.searchParams.append('matrixTypeID', matrixid);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function getDeliveryGuide() {
        return createAsyncThunk(
            `${name}/getDeliveryGuide`,
            async () => {
                try {
                    const url = new URL(`${baseUrl}/GetPipelineDeliveryGuid/`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return error;
                }
            }
        );
    }
    function updateGuide() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                   // const data = transformedData[0];
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdatePipelineDeliveryGuide`,transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error.message);
                }
            }
        );
    }

    function updateDeliveryMatrix() {
        return createAsyncThunk(
            `${name}/update`,
            async (transformedData, { rejectWithValue }) => {
                try {
                   // const data = transformedData[0];
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/UpdatePipelineDeliveryMatrix`,transformedData));
                    return response;
                } catch (error) {
                    return rejectWithValue(error.message);
                }
            }
        );
    }

    function updateGasVolume(){
        return createAsyncThunk(
            `${name}/updatevolume`,
            async (transformedData, { rejectWithValue }) => {
                try {
                //    const data = transformedData[0];
                   console.log(transformedData);
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl1}/UpdateVolumeLimitMessage`,{Data:transformedData}));
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
        state.deliveryMatrix = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getDeliveryMatrix();
        getDeliveryGuide();
        function getDeliveryMatrix() {
            var { pending, fulfilled, rejected } = extraActions.getDeliveryMatrix;
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
        function getDeliveryGuide() {
            var { pending, fulfilled, rejected } = extraActions.getDeliveryGuide;
            builder
                .addCase(pending, (state) => {
                    state.deliveryGuide = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.deliveryGuide = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.deliveryGuide = { error: action.error };
                });
        }

    };
}