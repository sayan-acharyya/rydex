import connectDb from "@/lib/db";
import razorpay from "@/lib/razorpay";
import Booking from "@/models/booking.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { bookingId } = await req.json();

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return Response.json(
                { message: "booking is not found." }, { status: 400 })
        }

        const order = await razorpay.orders.create({
            amount: booking.fare * 100,
            currency: "INR",
            receipt: booking._id.toString()
        })

        booking.bookingStatus = "awaiting_payment"
        await booking.save();

        return Response.json(
            {
                orderId: order.id,
                amount: order.amount
            },
            { status: 200 }
        )

    } catch (error) {
        return Response.json(
            {
                message: `payment create error ${error}`
            },
            { status: 500 }
        )
    }
}