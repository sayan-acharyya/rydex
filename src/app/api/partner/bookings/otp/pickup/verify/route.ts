import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { bookingId, otp } = await req.json();
        const booking = await Booking.findById(bookingId).populate("user")

        if (!booking) {
            return NextResponse.json(
                { message: "booking not found" },
                { status: 400 }
            )
        }

        if (!booking.pickUpOtp) {
            return NextResponse.json(
                { message: "pickup otp not generated" },
                { status: 400 }
            )
        }

        if (booking.pickUpOtp != otp) {
            return NextResponse.json(
                { message: "Wrong OTP Entered" },
                { status: 400 }
            )
        }

        if (booking.pickUpOtpExpires < new Date()) {
            return NextResponse.json(
                { message: "OTP Expired" },
                { status: 400 }
            )
        }

        booking.bookingStatus = "started"
        booking.pickUpOtp = ""
        booking.pickUpOtpExpires = ""

        await booking.save();

        return NextResponse.json(
            { message: "Pick up otp verified" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `pickup otp verify error ${error}` },
            { status: 500 }
        )
    }
}