import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Child = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type ChildrenType = {
  children: Child[];
  selectedChild: Child | null;
};

const initialState: ChildrenType = {
  children: [],
  selectedChild: null,
};

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;
    },
    setSelectedChild: (state, action: PayloadAction<Child | null>) => {
      state.selectedChild = action.payload;
    },
  },
});

export const { setChildren, setSelectedChild } = childrenSlice.actions;

export default childrenSlice.reducer;
