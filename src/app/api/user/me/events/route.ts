import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Registration from "@/models/Registration";

export async function GET() {
  try {
    await connectDB();

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const registrations = await Registration.find({
      userId: user.userId,
    }).populate({
      path: "eventId",
      populate: {
        path: "organizerId",
        select: "fullName email",
      },
    });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      events: registrations.map((r) => r.eventId),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}