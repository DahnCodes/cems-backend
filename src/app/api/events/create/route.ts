import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/models/Event'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    await connectDB()

    const user = await getUserFromRequest()

    // 1. Auth check
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 2. Role check
    if (user.role !== 'organizer' && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Only organizers can create events' },
        { status: 403 }
      )
    }

    const body = await req.json()

    const {
      title,
      description,
      category,
      venue,
      eventDate,
      capacity,
      coverImage,
    } = body

    // 3. Create event
    const event = await Event.create({
      title,
      description,
      category,
      venue,
      eventDate,
      capacity,
      coverImage,
      organizerId: user.userId,
    })

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
