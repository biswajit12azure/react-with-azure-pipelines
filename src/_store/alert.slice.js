import { createSlice } from '@reduxjs/toolkit';

// create slice

const name = 'alert';
const initialState = createInitialState();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers });

// exports

export const alertActions = { ...slice.actions };
export const alertReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        value: null
    }
}

function createReducers() {
    return {
        success,
        error,
        clear
    };

    // payload can be a string message ('alert message') or 
    // an object ({ message: 'alert message', showAfterRedirect: true })
    function success(state, action) {
        state.value = {
            type: 'success',
            header:action.payload?.header || '',
            message: action.payload?.message || action.payload,
            message2: action.payload?.message2 || '',
            showAfterRedirect: action.payload?.showAfterRedirect,
            islogout: action.payload?.islogout || false,
            buttonText: action.payload?.buttonText || 'Close'
        };
    }

    function error(state, action) {
        state.value = {
            type: 'error',
            header:action.payload?.header || '',
            message: action.payload?.message || action.payload,
            message2: action.payload?.message2 || '',
            showAfterRedirect: action.payload?.showAfterRedirect,
            islogout: action.payload?.islogout || false,
            buttonText: action.payload?.buttonText || 'Close'
        };
    }

    function clear(state) {
        // if showAfterRedirect flag is true the alert is not cleared 
        // for one route change (e.g. after successful registration)
        if (state.value?.showAfterRedirect) {
            state.value.showAfterRedirect = false;
        } else {
            state.value = null;
        }
    }
}
