import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Ticket from '@/models/Ticket'
import QRCode from 'qrcode'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params

    const ticket = await Ticket.findById(id)
      .populate('eventId', 'title eventDate venue')
      .populate('userId', 'fullName email');

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 })
    }

    const qrData = JSON.stringify({
      ticketId: ticket._id,
      ticketCode: ticket.ticketCode,
    })

    const qrCode = await QRCode.toDataURL(qrData)

    return NextResponse.json({
      success: true,
      ticket,
      qrCode,
    })
  } catch {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
