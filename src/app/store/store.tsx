import { configureStore } from '@reduxjs/toolkit';
import branchReducer from './branchSlice';

const branchStore = configureStore({
  reducer: {
    branch: branchReducer,
  },
});

export type BranchRootState = ReturnType<typeof branchStore.getState>;
export type BranchAppDispatch = typeof branchStore.dispatch;

export { branchStore };