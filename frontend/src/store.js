import { configureStore } from "@reduxjs/toolkit";
import authReducer from  "./features/authSlice"
import blogReducer from "./features/blogSlice"
import aiblogReducer from "./features/aiBlogSlice"
export const store = configureStore({
    reducer:{
auth:authReducer,
blog:blogReducer,
aiblog:aiblogReducer
    }
})