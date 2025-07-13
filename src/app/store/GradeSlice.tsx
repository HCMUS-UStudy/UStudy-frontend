import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GradeData, GradeItem } from "../types";
import { getAllGrades } from "../lib/services";

export const fetchAllGrades = createAsyncThunk(
  "grade/getAll",
  async ({
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: string;
  }) => {
    const response = await getAllGrades(filter, limit, page);
    console.log(response);
    return response;
  },
);

interface Props {
  grades: GradeItem[];
  page: number;
  limit: number;
  filter: string;
  totalPages: number;
  status: "pending" | "success" | "error";
}

const initialState: Props = {
  grades: [],
  totalPages: 0,
  page: 0,
  limit: 100,
  filter: "",
  status: "success",
};

const gradeSlice = createSlice({
  name: "grade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllGrades.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      fetchAllGrades.fulfilled,
      (state, action: PayloadAction<GradeData>) => {
        state.status = "success";
        state.grades = [...action.payload.content];
        state.totalPages = action.payload.totalPages;
      },
    );
    builder.addCase(fetchAllGrades.rejected, (state) => {
      state.status = "error";
      state.grades = [];
    });
  },
});

export const {} = gradeSlice.actions;

export default gradeSlice.reducer;
