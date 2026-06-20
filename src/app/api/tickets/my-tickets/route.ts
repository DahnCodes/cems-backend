import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import Ticket from '@/models/Ticket'

export async function GET() {
  try {
    await connectDB()

    const user = await getUserFromRequest()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const tickets = await Ticket.find({
      userId: user.userId,
    }).populate('eventId')

    return NextResponse.json({
      success: true,
      tickets,
    })
  } catch {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
