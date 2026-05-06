import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDb();

        // ✅ Auth check
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return Response.json({ message: "Pertner not found" }, { status: 400 });
        }

        if (partner.videoKycStatus !== "rejected") {
            return Response.json({ message: "you can't send KYC request at this time." }, { status: 400 });
        }


        partner.videoKycStatus = "pending";
        partner.videoKycRejectionReason = "";
        partner.videoKycRoomId = "";

        await partner.save();

        return Response.json(
            { success: true }
            , { status: 200 }
        );


    } catch (error) {
        return Response.json(
            { message: `kyc request error ${error}` },
            { status: 500 });
    }
}