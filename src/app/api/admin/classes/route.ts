import { getAllClasses } from "@/app/lib/services/class";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const res = await getAllClasses(query, currentPage - 1, 5);
    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
