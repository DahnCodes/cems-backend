import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Get token from headers
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = verifyToken(token);

    if (!decoded?.userId) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // 3. Fetch user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("GET /user/me error:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}