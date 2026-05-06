import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { roomId, action, reason } = await req.json();

        if (!roomId) {
            return Response.json({ message: "roomId is required" }, { status: 400 });
        }

        if (!["approved", "rejected"].includes(action)) {
            return Response.json({ message: "invalid actiion" }, { status: 400 });
        }

        const partner = await User.findOne({
            videoKycRoomId: roomId,
            role: "partner"
        });

        if (!partner) {
            return Response.json({ message: "partner not found" }, { status: 400 });
        }

        if (action === "approved") {
            partner.videoKycStatus = "approved";
            partner.videoKycRejectionReason = "";
            partner.partnerOnBoardingSteps = 5;
        }

        if (action === "rejected") {
            if (!reason) {
                return Response.json({ message: "Rejection reason is required" }, { status: 400 });
            } else {
                partner.videoKycStatus = "rejected";
                partner.videoKycRejectionReason = reason.trim();
            }

        }

        await partner.save();

        return Response.json(
            { status: partner.videoKycStatus },
            { status: 200 });


    } catch (error) {
        return Response.json(
            { message: `video kyc complete error ${error}` }
            , { status: 500 });
    }
}