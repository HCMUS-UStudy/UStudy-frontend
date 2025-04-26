import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ScreensType = {
  screens: string[];
};
const initialState: ScreensType = {
  screens: [],
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.screens = action.payload;
    },
  },
});

export const { setPermissions } = permissionSlice.actions;

export default permissionSlice.reducer;
