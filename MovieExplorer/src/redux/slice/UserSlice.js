import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name:'users',
    initialState:{
        users:[],
        // loading:false
    },

    reducers:{
        addUser: (state,action) =>{    //current_state and action
            //state.users = []
            //state.users.push()
            //action.payload = {name,email,mobile}

            state.users.push(action.payload);
        },
        updateUser: (state,action) =>{
            //yaha mujhe index milri hai but, 
            // agar hm pe id hai toh hum uska bhi istemal kr sakte hai
            state.users[state.users.index] = action.payload.data
        },
        deleteUser: (state,action) =>{
            state.users.splice(action.payload, 1); 
        }
    }
});

export const {addUser,updateUser,deleteUser} = UserSlice.actions;
export default UserSlice.reducer;
