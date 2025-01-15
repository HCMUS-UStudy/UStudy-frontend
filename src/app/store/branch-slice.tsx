import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Branch {
  id: string;
  name: string;
}

interface BranchState {
  selectedBranchId: string | null;
  branches: Branch[];
}

const initialState: BranchState = {
  selectedBranchId: null,
  branches: [],
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch: (state, action: PayloadAction<string>) => {
      state.selectedBranchId = action.payload;
    },
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
  },
});

export const { setBranch, setBranches } = branchSlice.actions;

export default branchSlice.reducer;
