import { createSlice } from "@reduxjs/toolkit";

const state = {
    userId: null,
    nickName: null,
    email: null,
    stateChange: false,
    avatarUrl: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: state,
    reducers: {
        updateUserProfile: (state, {payload}) => ({...state, userId: payload.userId, nickName: payload.nickName, email: payload.email, avatarUrl: payload.avatarUrl}),
        authStateChange: (state, {payload}) => ({...state, stateChange: payload.stateChange}),
        authSignOut: () => state,
    },
});
