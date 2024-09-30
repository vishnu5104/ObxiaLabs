import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("here it");
  try {
    const { name, subdomain } = await request.json();

    console.log("the domain: ", request);

    if (!name || !subdomain) {
      return NextResponse.json(
        { error: "Name and subdomain are required" },
        { status: 400 }
      );
    }

    const existingDashboard = await prisma.dashboard.findUnique({
      where: { subdomain },
    });

    if (existingDashboard) {
      return NextResponse.json(
        { error: "Subdomain already exists" },
        { status: 409 }
      );
    }

    const newDashboard = await prisma.dashboard.create({
      data: { name, subdomain },
    });

    return NextResponse.json(newDashboard, { status: 201 });
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
