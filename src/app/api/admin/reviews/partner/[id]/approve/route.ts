import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
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
        const partnerId = (await context.params).id;

        const partner = await User.findById(partnerId);


        if (!partner || partner.role !== "partner") {
            return Response.json({ message: "partner  not found" }, { status: 404 });
        }

        if (partner.partnerStatus === "approved") {
            return Response.json(
                { message: "partner already approved" },
                { status: 400 });
        }

        partner.partnerStatus = "approved";
        partner.partnerOnBoardingSteps = 4;

        await partner.save();

        const partnerDocs = await PartnerDocs.findOne({ owner: partnerId });
        const partnerBank = await PartnerBank.findOne({ owner: partnerId });

        if (!partnerBank || !partnerDocs) {
            return Response.json(
                { message: "partner Bank or Docs not found" },
                { status: 404 });
        }

        partnerDocs.status = "approved";
        await partnerDocs.save();

        partnerBank.status = "verified";
        await partnerBank.save();

        return Response.json(
            { message: "partner approved successfully" },
            { status: 200 }
        )
    } catch (error) {
        return Response.json(
            { message: `partner approve error  ${error}` }
            , { status: 500 });
    }
}