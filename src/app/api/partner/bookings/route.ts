import { auth } from "@/auth";
import connectDb from "@/lib/db";

import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const bookings = await Booking.find({
            driver: session.user.id
        })
        .populate({
            path: "user",
            model: User
        })
        .populate({
            path: "driver",
            model: User
        })
        .populate({
            path: "vehicle",
            model: Vehicle
        })
        .sort({ createdAt: -1 });

        return NextResponse.json(bookings, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                message: `get booking for partner error ${error}`
            },
            { status: 500 }
        );
    }
}