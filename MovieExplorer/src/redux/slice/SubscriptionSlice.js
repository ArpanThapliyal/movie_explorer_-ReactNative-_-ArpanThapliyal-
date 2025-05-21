import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
    name:'subscriptionStatus',
    initialState:{
        plan_type:null,
        updated_at: null,
        expires_at: null,
    },
    reducers:{
        setSubscription :(state,action)=>{
            state.plan_type = action.payload.plan_type;
            state.updated_at = action.payload.updated_at;
            state.expires_at = action.payload.expires_at;
        },
        clearSubscription :(state) =>{
            state.plan_type = null;
            state.updated_at = null;
            state.expires_at = null;
        }
    }
});

export const { setSubscription,clearSubscription} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;