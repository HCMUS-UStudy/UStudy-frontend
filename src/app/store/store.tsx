import { configureStore } from "@reduxjs/toolkit";
import branchReducer from "./branch-slice";

const branchStore = configureStore({
  reducer: {
    branch: branchReducer,
  },
});

export type BranchRootState = ReturnType<typeof branchStore.getState>;
export type BranchAppDispatch = typeof branchStore.dispatch;

export { branchStore };
