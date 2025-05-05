import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'user',
    initialState: {
      role: null,
      email: null,
      // loading: false
    },
    reducers: {
      setUser: (state, action) => {
        state.role = action.payload.role;
        state.email = action.payload.email;
      },
      clearUser: state => {  //  for logout
        state.role = null;
        state.email = null;
      }
    }
  });
  
  export const { setUser, clearUser } = UserSlice.actions;
  export default UserSlice.reducer;
  