import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChildrenType = {
  children: string[];
  selectedId: string;
};

const initialState: ChildrenType = {
  children: [],
  selectedId: "",
};

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<string[]>) => {
      state.children = action.payload;
    },
    setSelectedChild: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { setChildren, setSelectedChild } = childrenSlice.actions;

export default childrenSlice.reducer;
