import { getAllGrades } from "@/app/lib/services/grade";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getAllGrades("", 15, 0);
    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
