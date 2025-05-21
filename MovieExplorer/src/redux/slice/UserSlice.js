import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'user',
    initialState: {
      role: null,
      email: null,
      token: null,
      // name: null,
      
    },
    reducers: {
      setUser: (state, action) => {
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.token = action.payload.token;
        // state.name = action.payload.name;
      },
      clearUser: state => {  //  for logout
        state.role = null;
        state.email = null;
        state.token = null;
        // state.name = null;
      }
    }
  });
  
  export const { setUser, clearUser } = UserSlice.actions;
  export default UserSlice.reducer;
  