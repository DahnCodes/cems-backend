import { NextResponse } from "next/server";
import argon2 from "argon2";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/schemas/auth.schema";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // validate input
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, email, password } = result.data;

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // hash password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    // create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}