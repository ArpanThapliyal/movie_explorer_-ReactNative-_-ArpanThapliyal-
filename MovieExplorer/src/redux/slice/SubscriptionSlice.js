import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
    name:'subscriptionStatus',
    initialState:{
        plan_type:null,
    },
    reducers:{
        setSubscription :(state,action)=>{
            state.plan_type = action.payload.plan_type;
        },
        clearSubscription :(state) =>{
            state.plan_type = null;
        }
    }
});

export const { setSubscription,clearSubscription} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;