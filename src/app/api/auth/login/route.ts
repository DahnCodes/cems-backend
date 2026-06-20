import { NextResponse } from 'next/server'
import argon2 from 'argon2'
import { cookies } from 'next/headers'

import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // 1. Check user exists
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email' },
        { status: 401 }
      )
    }

    // 2. Verify password
    const isValid = await argon2.verify(user.password, password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      )
    }

    // 3. Create JWT
    const token = signToken({
      userId: user._id,
      role: user.role,
      email: user.email,
    })
    
    // 4. Store in HttpOnly cookie
    ;(await cookies()).set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })

    // 5. Return response
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
