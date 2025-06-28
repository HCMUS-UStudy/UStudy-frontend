import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ScreensType = {
  screens: string[];
  status: "pending" | "error" | "success";
};
const initialState: ScreensType = {
  screens: [],
  status: "success",
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.screens = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<"success" | "pending" | "error">,
    ) => {
      state.status = action.payload;
    },
  },
});

export const { setPermissions, setStatus } = permissionSlice.actions;

export default permissionSlice.reducer;
