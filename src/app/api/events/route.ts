import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  console.log("🚀 EVENTS API HIT");

  try {
    console.log("🔌 Connecting to DB...");
    await connectDB();
    console.log("✅ DB connected");

    console.log("📦 Fetching events...");

    const events = await Event.find({ status: "published" })
      .populate("organizerId", "fullName email")
      .sort({ createdAt: -1 });

    console.log("📊 Events fetched:", events.length);

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: unknown) {
    console.error("❌ EVENTS API FAILED");

    // Full raw error
    console.error("🔴 RAW ERROR:", error);

    // Safer formatted error output
    if (error instanceof Error) {
      console.error("🧨 MESSAGE:", error.message);
      console.error("📍 STACK:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    console.log("🏁 EVENTS API END");
  }
}