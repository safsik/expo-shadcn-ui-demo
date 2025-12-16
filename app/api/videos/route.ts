// app/api/streams/route.ts
import { NextResponse } from "next/server";
import { HLS_STREAMS } from "../../data/videos"; // Adjust path to where your file is


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 1. Parse Query Params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const search = (searchParams.get("q") || "").toLowerCase();
  const id = searchParams.get("id");


  // 2. Filter (Search)
  let results = HLS_STREAMS;

  if (id) {
    results = results.filter((s) => s.id === id);
  }

  if (search) {
    results = results.filter((s) =>
      s.title.toLowerCase().includes(search) ||
      s.author.toLowerCase().includes(search)
    );
  }

  // 3. Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = results.slice(startIndex, endIndex);

  // 4. Return Response
  if (id) {
    return NextResponse.json({
      channel: paginatedData
    })
  }

  return NextResponse.json({
    data: paginatedData,
    meta: {
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
    },
  });
}