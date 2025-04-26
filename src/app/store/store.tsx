import { configureStore } from "@reduxjs/toolkit";
import branchReducer from "./branch-slice";
import permissionReducer from "./PermissionScreenSlice";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    branch: branchReducer,
    permission: permissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export { store };
