import { getAllCourses } from "@/app/lib/services/course";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getAllCourses("", 15, 0);
  return NextResponse.json(res);
}
