import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../slice/UserSlice';
import genreReducer from '../slice/GenreSlice';
import movieReducer from '../slice/MovieSlice';

const myStore = configureStore({
    reducer: {
        user: userReducer,
        genre: genreReducer,
        movie: movieReducer,
      }
});

export default myStore;