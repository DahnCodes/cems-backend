import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import Event from '@/models/Event'

export async function GET() {
  try {
    await connectDB()

    const user = await getUserFromRequest()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const events = await Event.find({
      organizerId: user.userId,
    }).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
