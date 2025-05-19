import { connectMongoDB } from "@/lib/mongodb";
import * as models from "@/models/stock";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    console.log(body.json)
    await models.Atharv.insertMany(body.json);
    return NextResponse.json(
      { message: "Data Added Successfully....!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while adding data:", error.message);
    return NextResponse.json(
      { message: "Failed to add data" },
      { status: 500 }
    );
  }
}

