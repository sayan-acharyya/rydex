import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                { booking: null }
            );
        }

        const user = await User.findOne({ email: session.user.email })

        const booking = await Booking.findOne({
            user: user?._id,
            bookingStatus: { $in: ["requested", "awaiting_payment", "confirmed", "started"] }

        })



        return Response.json(
            { booking },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: `get booking error ${error}` },
            { status: 500 }
        );
    }
}