import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

const vehicleRegex = /^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{4}$/;

export async function POST(req: Request) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        // ✅ Get user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        // ✅ Parse body
        const { type, number, vehicleModel } = await req.json();

        if (!type || !number || !vehicleModel) {
            return Response.json(
                { message: "Missing required details" },
                { status: 400 }
            );
        }

        // ✅ Validate vehicle number
        if (!vehicleRegex.test(number)) {
            return Response.json(
                { message: "Invalid vehicle number format" },
                { status: 400 }
            );
        }

        // ✅ Normalize number
        const vehicleNumber = number.toUpperCase();

        // ✅ Check duplicate vehicle number
        const duplicate = await Vehicle.findOne({ number: vehicleNumber });
        if (duplicate) {
            return Response.json(
                { message: "Vehicle already registered" },
                { status: 400 }
            );
        }

        // ✅ Update onboarding step BEFORE return
        if (user.partnerOnBoardingSteps < 1) {
            user.partnerOnBoardingSteps = 1;
            user.role = "partner";
            await user.save();
        }

        // ✅ Check existing vehicle for this user
        let vehicle = await Vehicle.findOne({ owner: user._id });

        if (vehicle) {
            // 🔁 Update existing
            vehicle.type = type;
            vehicle.number = vehicleNumber;
            vehicle.vehicleModel = vehicleModel;
            vehicle.status = "pending";

            await vehicle.save();

            return Response.json(vehicle, { status: 200 });
        }

        // 🆕 Create new vehicle
        vehicle = await Vehicle.create({
            owner: user._id, // ⚠️ important (you missed this earlier)
            type,
            number: vehicleNumber,
            vehicleModel,
            status: "pending"
        });

        return Response.json(vehicle, { status: 201 });

    } catch (error) {
        console.error("Vehicle POST Error:", error);

        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // ✅ Get user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // ✅ Get vehicle
        const vehicle = await Vehicle.findOne({ owner: user._id });

        if (vehicle) {
            return Response.json(vehicle, { status: 200 });
        }


        return Response.json({ vehicle: null }, { status: 200 });
        
    } catch (error) {
        console.error("Vehicle GET Error:", error);

        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}