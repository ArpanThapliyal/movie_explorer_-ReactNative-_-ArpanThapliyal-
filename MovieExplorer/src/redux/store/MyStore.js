import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../slice/UserSlice';
import genreReducer from '../slice/GenreSlice';
import movieReducer from '../slice/MovieSlice';
import tokenReducer from '../slice/DeviceTokenSlice';
import subscriptionReducer from '../slice/SubscriptionSlice';

const myStore = configureStore({
    reducer: {
        user: userReducer,
        genre: genreReducer,
        movie: movieReducer,
        token: tokenReducer,
        subscription : subscriptionReducer,
        
      }
});

export default myStore;