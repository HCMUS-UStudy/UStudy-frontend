import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../types";

const initialState: UserData = {
  avatar: "cat",
  email: "",
  genId: "",
  gender: "MALE",
  name: "",
  role: {
    createdAt: "",
    defaultRoute: "ADMIN",
    description: "",
    id: "",
    isDeleted: false,
    name: "",
    updatedAt: "",
  },
  branches: [],
  isVerified: false,
  hadClass: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { setUserData, updateAvatar } = userSlice.actions;

export default userSlice.reducer;
