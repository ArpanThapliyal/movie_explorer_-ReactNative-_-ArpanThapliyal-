import { createSlice } from "@reduxjs/toolkit";

const genreSlice = createSlice({
    name:'selectedGenre',
    initialState:{
        selectedGenre:'All',
    },

    reducers:{
        setSelectedGenre :(state,action) =>{
            state.selectedGenre = action.payload;   
        }
    }
});

export const {setSelectedGenre} = genreSlice.actions;
export default genreSlice.reducer;