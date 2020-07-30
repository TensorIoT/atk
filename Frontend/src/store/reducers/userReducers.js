import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: { loggedUser: "" },
  reducers: {
    setUser: (state, { payload }) => {
      state.loggedUser = payload;
    },
  },
});

export const { setUser: setUserAction } = userSlice.actions;

export default userSlice.reducer;
