import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { trackPromise } from "react-promise-tracker";
import { fetchWrapper } from "_utils/fetch-wrapper";

// create slice

const name = "monthlyStorage";
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const monthlyStorageAction = { ...slice.actions, ...extraActions };
export const monthlyStorageReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    monthlyStorageList: null,
    filteredMonthlyStorageList: null,
  };
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
      `${name}/getMonthlyStorage`,
      async (data, { rejectWithValue }) => {
        try {
          const url = new URL(`${baseUrl}/GetMonthlyStorageReport`);
          const response = await trackPromise(fetchWrapper.post(url.toString(),{Data:data}));
          return response;
        } catch (error) {
          console.log(error)
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
          const response = await trackPromise(
            fetchWrapper.post(`${baseUrl}/FilterMonthlyStorage`, data)
          );
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
      async (transformedData, { rejectWithValue }) => {
        try {
          const response = await trackPromise(
            fetchWrapper.post(
              `${baseUrl}/CreateMonthlyStorageMaster`,
              transformedData
            )
          );
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
      async (transformedData, { rejectWithValue }) => {
        try {
          const response = await trackPromise(
            fetchWrapper.post(
              `${baseUrl}/BulkUpdateMonthlyStorages`,
              transformedData
            )
          );
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
          const response = await trackPromise(
            fetchWrapper.delete(
              `${baseUrl}/ActivateMonthlyStorages`,
              transformedData
            )
          );
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
    clear,
  };

  function clear(state) {
    state.monthlyStorageList = null;
    state.filteredMonthlyStorageList = null;
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
          state.monthlyStorageList = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          const data = action.payload;
          state.monthlyStorageList = data.Data;
        })
        .addCase(rejected, (state, action) => {
          state.monthlyStorageList = { error: action.error };
        });
    }

    function filter() {
      var { pending, fulfilled, rejected } = extraActions.filter;
      builder
        .addCase(pending, (state) => {
          state.filteredMonthlyStorageList = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          const data = action.payload;
          state.filteredMonthlyStorageList = data.Data;
        })
        .addCase(rejected, (state, action) => {
          state.filteredMonthlyStorageList = { error: action.error };
        });
    }
  };
}
