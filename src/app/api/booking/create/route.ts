import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();

        if (!session || !session.user) {
            return Response.json(
                { message: "user is not authenticated" },
                { status: 401 } // ✅ fixed
            );
        }

        const {
            driverId,
            vehicleId,
            pickUpAddress,
            dropAddress,
            pickUpLocation,
            dropLocation,
            fare,
            mobileNumber
        } = await req.json();

        if (
            !driverId ||
            !vehicleId ||
            !pickUpLocation?.coordinates ||
            !dropLocation?.coordinates
        ) {
            return Response.json(
                { message: "missing required details" },
                { status: 400 }
            );
        }

        const driver = await User.findById(driverId);
        if (!driver) {
            return Response.json(
                { message: "driver not found" },
                { status: 400 }
            );
        }

        const existing = await Booking.findOne({
            user: session.user.id,
            bookingStatus: {
                $in: ["requested", "awaiting_payment", "confirmed", "started"]
            }
        });

        if (existing) {
            // ✅ also populate existing booking
            const populatedExisting = await Booking.findById(existing._id)
                .populate("driver")
                .populate("vehicle");

            return Response.json(populatedExisting, { status: 200 });
        }

        // ✅ create booking (store only IDs)
        const booking = await Booking.create({
            user: session.user.id,
            driver: driver._id,
            vehicle: vehicleId,
            pickUpAddress: pickUpAddress.trim(),
            dropAddress: dropAddress.trim(),
            pickUpLocation,
            dropLocation,
            fare,
            userMobileNumber: mobileNumber?.trim(),
            driverMobileNumber: driver.mobileNumber?.trim(),
            bookingStatus: "requested"
        });

        // 🔥 IMPORTANT: fetch again with populate
        const populatedBooking = await Booking.findById(booking._id)
            .populate("driver")
            .populate("user")
            .populate("vehicle");

        return Response.json(populatedBooking, { status: 200 });

    } catch (error) {
        console.error(error); // ✅ log internally
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}