import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'
import { signToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    await connectDB()

    // 1. Get logged-in user from JWT
    const currentUser = await getUserFromRequest()

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Find user in DB
    const user = await User.findById(currentUser.userId)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // 3. Already organizer check
    if (user.role === 'organizer') {
      return NextResponse.json({
        success: true,
        message: 'You are already an organizer',
        role: user.role,
      })
    }

    // 4. Upgrade role
    user.role = 'organizer'
    await user.save()

    user.role = 'organizer'
    await user.save()

    // regenerate token with updated role
    const newToken = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    })

    //overwrite cookie
    ;(
      await
      cookies()
    ).set('token', newToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json({
      success: true,
      message: 'You are now an organizer 🎉',
      user: {
        id: user._id,
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
