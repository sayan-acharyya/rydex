import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { data, object } from "motion/react-client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const bookings = await Booking.find({
            paymentStatus: "paid",
            createdAt: { $gt: sevenDaysAgo }
        }).select("partnerAmount createdAt")

        let earningMap: Record<string, number> = {}

        bookings.forEach(b => {
            const date = new Date(b.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            })

            if (!earningMap[date]) {
                earningMap[date] = 0
            }

            earningMap[date] = earningMap[date] + b.partnerAmount || 0;
        });

        const earnings = Object.entries(earningMap).map(([data, earnings]) => ({
            data, earnings
        }))

        return NextResponse.json(
            earnings,
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `partner earning error ${error}` },
            { status: 500 }
        )
    }
}