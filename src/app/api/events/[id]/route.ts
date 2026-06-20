import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/models/Event'
import Registration from '@/models/Registration'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params

    console.log('PARAMS:', id)

    const event = await Event.findById(id).populate(
      'organizerId',
      'fullName email'
    )

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    const user = await getUserFromRequest()

    let isRegistered = false

    if (user) {
      const registration = await Registration.findOne({
        userId: user.userId,
        eventId: id,
      })

      isRegistered = !!registration
    }

    const slotsLeft = event.capacity - event.registeredCount

    return NextResponse.json({
      success: true,
      event,
      meta: {
        isRegistered,
        slotsLeft,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
