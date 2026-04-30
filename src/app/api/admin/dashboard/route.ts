import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        // ✅ Get user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return Response.json({ message: "Admin not found" },
                { status: 404 });
        }

        const totalPartners = await User.countDocuments({ role: "partner" });
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" });
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" });
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" });

        const pendingPartnerUsers = await User.find({
            role: "partner",
            partnerStatus: "pending",
            partnerOnBoardingSteps: 3
        });

        const partnerIds = pendingPartnerUsers.map((p) => p._id)
        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        })

        const vehicleTypeMap = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        )

        const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id))
        }))

        return NextResponse.json({
            totalPartners,
            totalPendingPartners,
            totalApprovedPartners,
            totalRejectedPartners,
            pendingPartnerUsers,
            pendingPartnersReviews

        }, {
            status: 200
        })


    } catch (error) {
        return Response.json(
            { message: `admin dashboard error ${error}` }
            , { status: 500 });
    }
}

//1:39:00