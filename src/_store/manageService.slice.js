import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { fetchWrapper } from '_utils/fetch-wrapper';

// Slice name
const name = 'manageService';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// Exports
export const manageServiceActions = { ...slice.actions, ...extraActions };
export const manageServiceReducer = slice.reducer;

// Initial State
function createInitialState() {
  return {
    managerServiceDetails: null,
    loading: false,
    error: null,
  };
}

// Extra Actions (for API calls)
function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_MARKETER_API_URL}/api/Marketer`;

  return {
    getManagerServiceDetails: getManagerServiceDetails(),
  };

  // Async thunk for getting Manager Service Details
  function getManagerServiceDetails() {
    return createAsyncThunk(
      `${name}/getManagerServiceDetails`,
      async (_, { rejectWithValue }) => {
        try {
          const url = `${baseUrl}/ManageServicefuelChargeDetails`;
          const response = await trackPromise(fetchWrapper.get(url));
          return response;
        } catch (error) {
          return rejectWithValue(error);
        }
      }
    );
  }
}

// Reducers
function createReducers() {
  return {
    clear,
  };

  function clear(state) {
    state.managerServiceDetails = null;
  }
}

// Extra Reducers (to handle different states: pending, fulfilled, rejected)
function createExtraReducers() {
  return (builder) => {
    getManagerServiceDetails();

    // Handle getManagerServiceDetails thunk actions
    function getManagerServiceDetails() {
      const { pending, fulfilled, rejected } = extraActions.getManagerServiceDetails;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          const data = action.payload;
          state.managerServiceDetails = data.Data;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
          state.error = action.error;
        });
    }
  };
}
