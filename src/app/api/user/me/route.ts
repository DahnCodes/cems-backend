import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("ME ROUTE ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}