import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import Event from '@/models/Event'
import Registration from '@/models/Registration'
import Ticket from '@/models/Ticket'
import { generateTicketCode } from '@/lib/tickets'

export async function POST(req: Request) {
  try {
    await connectDB()

    const user = await getUserFromRequest()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await req.json()

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID required' },
        { status: 400 }
      )
    }

    // 1. Check event exists
    const event = await Event.findById(eventId)

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    // 2. Check capacity
    if (event.registeredCount >= event.capacity) {
      return NextResponse.json({ message: 'Event is full' }, { status: 400 })
    }

    // 3. Prevent duplicate registration
    const existing = await Registration.findOne({
      userId: user.userId,
      eventId,
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Already registered' },
        { status: 409 }
      )
    }

    // 4. Create registration
    const registration = await Registration.create({
      userId: user.userId,
      eventId,
    })

    const ticket = await Ticket.create({
      ticketCode: generateTicketCode(),
      eventId,
      userId: user.userId,
      registrationId: registration._id,
    })

    // 5. Increase count
    event.registeredCount += 1
    await event.save()

    return NextResponse.json({
      success: true,
      message: 'Registered successfully 🎉',
      ticket: {
        id: ticket._id,
        ticketCode: ticket.ticketCode,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
