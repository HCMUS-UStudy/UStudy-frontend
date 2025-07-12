import { configureStore } from "@reduxjs/toolkit";
import branchReducer from "./branch-slice";
import permissionReducer from "./PermissionScreenSlice";
import childrenReducer from "./ChildrenSlice";
import encryptedIdReducer from "./EncryptedIdSlice";
import chatReducer from "./ChatSlice";
import gradeReducer from "./GradeSlice";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    branch: branchReducer,
    permission: permissionReducer,
    children: childrenReducer,
    encryptedId: encryptedIdReducer,
    chat: chatReducer,
    grades: gradeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const _useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppSelector = useSelector.withTypes<RootState>();

export { store };
