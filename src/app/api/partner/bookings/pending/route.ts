import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return Response.json({ message: "Pertner not found" }, { status: 400 });
        }

        const bookings = await Booking.find({
            driver: partner._id,
            bookingStatus: "requested"
        })

        return Response.json(bookings, { status: 200 })

    } catch (error) {
        return Response.json(
            { message: `fetch pending request error ${error}` },
            { status: 500 });
    }
}