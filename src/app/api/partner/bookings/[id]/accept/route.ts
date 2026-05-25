import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import axios from "axios";
import { NextRequest } from "next/server";


export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = (await context.params).id;

        const booking = await Booking.findById(id)

        if (!booking || booking.bookingStatus !== "requested") {
            return Response.json({ message: "Invalid" }, { status: 400 });
        }

        booking.bookingStatus = "awaiting_payment"
        booking.paymentDeadline = new Date(Date.now() + 5 * 60 * 1000)

        await booking.save();

        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
            event: "accept-booking",
            userId: booking.user,
            data: booking.bookingStatus
        })


        return Response.json({ success: true }, { status: 200 });

    } catch (error) {
        return Response.json({ message: `accept request error ${error}` }, { status: 500 });

    }
}