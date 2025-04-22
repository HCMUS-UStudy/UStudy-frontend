import { getAllCourses } from "@/app/lib/services/course";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getAllCourses("", 15, 0);
    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
