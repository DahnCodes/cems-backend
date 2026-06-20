import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      httpOnly: true,
      secure: true,      
      sameSite: "none",
      path: "/",
      expires: new Date(0), 
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}