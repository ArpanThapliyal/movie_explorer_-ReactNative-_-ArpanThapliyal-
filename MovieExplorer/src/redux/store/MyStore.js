import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../slice/UserSlice';
import genreReducer from '../slice/GenreSlice';

const myStore = configureStore({
    reducer: {
        user: userReducer,
        genre: genreReducer,
      }
});

export default myStore;