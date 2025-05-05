import { createSlice } from "@reduxjs/toolkit";


const MovieSlice = createSlice({
    name:'movie',
    initialState:{
        id:null,
    },

    reducers:{
        setId :(state,action) =>{
            state.id = action.payload;
        },
        clearId :(state) =>{
            state.id = null;
        }
    }
});

export const {setId,clearId} = MovieSlice.actions;
export default MovieSlice.reducer;

