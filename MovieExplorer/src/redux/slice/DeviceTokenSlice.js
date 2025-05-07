import { createSlice } from "@reduxjs/toolkit";

const deviceTokenSlice = createSlice({
    name: 'deviceToken',
    initialState: {
      device_token: null
    },
    reducers: {
      setDeviceToken: (state, action) => {
        state.token = action.payload.device_token;
      },
    }
  });
  
  export const { setDeviceToken} = deviceTokenSlice.actions;
  export default deviceTokenSlice.reducer;
  