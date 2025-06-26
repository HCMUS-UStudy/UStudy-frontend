import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EncryptedId = {
  encryptedId: string;
};

const initialState: EncryptedId = {
  encryptedId: "",
};

const encryptedIdSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setEncryptedId: (state, action: PayloadAction<string>) => {
      state.encryptedId = action.payload;
    },
  },
});

export const { setEncryptedId } = encryptedIdSlice.actions;

export default encryptedIdSlice.reducer;
