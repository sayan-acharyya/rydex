import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const vehicle = await Vehicle.findOne({ owner: session.user.id }).populate("owner");

        if (!vehicle) {
            return Response.json({ message: "vehicle not found" }, { status: 400 });
        }

        return Response.json(vehicle, { status: 200 });

    } catch (error) {
        return Response.json({ message: `vehicle get error ${error}` }, { status: 500 });
    }
}