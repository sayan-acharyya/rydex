import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
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

        booking.bookingStatus = "cancelled"
 
        await booking.save();

        return Response.json({ success: true }, { status: 200 });

    } catch (error) {
        return Response.json({ message: `cancel booking error ${error}` }, { status: 500 });

    }
}