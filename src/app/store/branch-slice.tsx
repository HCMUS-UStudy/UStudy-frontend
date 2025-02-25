import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Branch } from "../types/type";

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
    setSelectedBranch: (state, action: PayloadAction<string>) => {
      state.selectedBranchId = action.payload;
    },
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
  },
});

export const { setSelectedBranch, setBranches } = branchSlice.actions;

export default branchSlice.reducer;
