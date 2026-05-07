import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";


export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const vehicleId = (await context.params).id;

        const vehicle = await Vehicle.findById(vehicleId).populate("owner")


        if (!vehicle) {
            return Response.json({ message: "vehicle not found" }, { status: 404 });
        }
        return Response.json(
            vehicle,
            { status: 200 }
        );


    } catch (error) {
        return Response.json(
            { message: `vehicle preview get error ${error}` },
            { status: 500 });
    }
}