import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const {
            bookingId,
            razorpay_payment_id,
            razorpay_signature,
            razorpay_order_id
        } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            throw new Error("RAZORPAY_KEY_SECRET is missing");
        }

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature != razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "Invalid Signature" },
                { status: 400 }
            )
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return Response.json(
                { success: false, message: "booking is not found." })
        }
        const adminCommission = booking.fare * 0.10;
        const partnerAmount = booking.fare - adminCommission;

        booking.adminCommission = adminCommission
        booking.partnerAmount = partnerAmount
        booking.paymentStatus = "paid"
        booking.bookingStatus = "confirmed"

        await booking.save()

        return NextResponse.json(
            {
                success: true, adminCommission, partnerAmount
            },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: `verify payment error ${error}`
            },
            { status: 500 }
        );
    }
}