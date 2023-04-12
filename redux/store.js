import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authReducer";

const rootreducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
})

export const store = configureStore({
    reducer: rootreducer,
});

