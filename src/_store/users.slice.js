import { createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import { trackPromise } from 'react-promise-tracker';
import { authActions } from '_store';
import { fetchWrapper } from '_utils/fetch-wrapper';

// create slice

const name = 'users';
const initialState = createInitialState();
const extraActions = createExtraActions();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        list: [],
        item: null,
        userDetails: null,
        supportDetails:null
    }
}

function createExtraActions() {
    //const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Account`;

    return {
        getAll: getAll(),
        getById: getById(),
        update: update(),
        delete: _delete(),
        getUserDetailsById: getUserDetailsById(),
        getSupportDetails:getSupportDetails(),
        updateUserProfileDetails: updateUserProfileDetails(),
        deleteUserById: deleteUserById()
    };

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await trackPromise(fetchWrapper.get(baseUrl))
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await trackPromise(fetchWrapper.get(`${baseUrl}/${id}`))
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async function ({ id, data, portalName }, { getState, dispatch }) {
                await trackPromise(fetchWrapper.put(`${baseUrl}/${id}`, { data, portalName }));
            }
        );
    }

    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id, { getState, dispatch }) {
                await trackPromise(fetchWrapper.delete(`${baseUrl}/${id}`));

                // auto logout if the logged in user deleted their own record
                if (id === getState().auth.userId) {
                    dispatch(authActions.logout());
                }
            }
        );
    }

    function getUserDetailsById() {
        return createAsyncThunk(
            `${name}/getUserDetailsById`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/GetBasicUserDetailsByID/${id}`);
                    const response = await trackPromise(fetchWrapper.get(url.toString()));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

       function getSupportDetails() { 
            return createAsyncThunk(
                `${name}/getSupportDetails`,
                async (id, { rejectWithValue }) => {
                    try {
                        const url = new URL(`${baseUrl}/GetSupportByID/${id}`);
                        const response = await trackPromise(fetchWrapper.get(url.toString()));
                        return response;
                    } catch (error) {
                        return rejectWithValue(error);
                    }
                }
            );
        }

    function updateUserProfileDetails() {
        return createAsyncThunk(
            `${name}/updateUserProfileDetails`,
            async ({ data }, { rejectWithValue }) => {
                try {
                    const response = await trackPromise(fetchWrapper.put(`${baseUrl}/SaveUserProfile`, { Data: data }));
                    return response;
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        );
    }

    function deleteUserById() {
        return createAsyncThunk(
            `${name}/deleteUserById`,
            async (id, { rejectWithValue }) => {
                try {
                    const url = new URL(`${baseUrl}/DeleteUserByID`);
                    url.searchParams.append('UserId', id);
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
        state.item = null;
    }
}

function createExtraReducers() {
    return (builder) => {
        getAll();
        getById();
        _delete();
        getUserDetailsById();
        getSupportDetails();

        function getAll() {
            var { pending, fulfilled, rejected } = extraActions.getAll;
            builder
                .addCase(pending, (state) => {
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
                });
        }

        function getById() {
            var { pending, fulfilled, rejected } = extraActions.getById;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });
        }

        function _delete() {
            var { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const user = state.list.value.find(x => x.id === action.meta.arg);
                    if (user) user.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    state.list.value = state.list.value.filter(x => x.id !== action.meta.arg);
                })
                .addCase(rejected, (state, action) => {
                    const user = state.list.value.find(x => x.id === action.meta.arg);
                    if (user) user.isDeleting = false;
                });
        }

        function getUserDetailsById() {
            var { pending, fulfilled, rejected } = extraActions.getUserDetailsById;
            builder
                .addCase(pending, (state) => {
                    state.userDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.userDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.userDetails = { error: action.error };
                });
        }

        function getSupportDetails() {
            var { pending, fulfilled, rejected } = extraActions.getSupportDetails;
            builder
                .addCase(pending, (state) => {
                    state.supportDetails = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    const data = action.payload;
                    state.supportDetails = data.Data;
                })
                .addCase(rejected, (state, action) => {
                    state.supportDetails = { error: action.error };
                });
        }
    };
}

