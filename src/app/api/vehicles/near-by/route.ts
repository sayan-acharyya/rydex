import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();

        if (!session || !session.user) {
            return Response.json(
                { message: "user is not authenticated" },
                { status: 400 }
            )
        }

        const { latitude, longitude, vehicleType } = await req.json();

        if (!latitude || !longitude) {
            return Response.json(
                { message: "coordinates not found" },
                { status: 400 }
            )
        }

        const partners = await User.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })

        const partnerIds = partners.map(p => p._id)

        if (partnerIds.length == 0) {
            return Response.json(
                 [],
                { status: 200 }
            )
        }

        const vehicles = await Vehicle.find({
            owner: { $in: partnerIds },
            type: vehicleType,
            status: "approved",
            isActive: true
        }).lean()

        return Response.json(
            vehicles,
            { status: 200 }
        )


    } catch (error) {
        return Response.json(
            { message: `near by vehicle error ${error}` },
            { status: 500 }
        )
    }
} 