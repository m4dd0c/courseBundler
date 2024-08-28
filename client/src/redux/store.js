import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducers.js";
import courseReducer from "./reducers/courseReducers.js";
import subscriptionReducer from "./reducers/subscriptionReducers.js";
import adminReducer from "./reducers/adminReducers.js";
import globalReducer from "./reducers/globalReducer.js";
import axios from "axios";

export const server = "https://coursebundler-9z25.onrender.com/api/v1";

export const instance = axios.create({
  baseURL: server,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const store = configureStore({
  reducer: {
    userReducer,
    courseReducer,
    subscriptionReducer,
    adminReducer,
    globalReducer,
  },
});

export default store; //now run
