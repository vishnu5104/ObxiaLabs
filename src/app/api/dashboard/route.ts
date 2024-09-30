import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain");

  console.log("API: Received request for subdomain:", subdomain);

  if (!subdomain) {
    console.log("API: Subdomain is required");
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const dashboard = await prisma.dashboard.findUnique({
      where: { subdomain },
      select: { id: true, name: true, subdomain: true },
    });

    console.log("API: Dashboard found:", dashboard);

    if (!dashboard) {
      console.log("API: Dashboard not found");
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("API: Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
