import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import languageReducer from "./reducers/language";


const store = configureStore({
    reducer:{
        language:languageReducer,
        user : userReducer,
    },
})

export default store;