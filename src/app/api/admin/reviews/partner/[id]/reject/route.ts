import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";


export async function POST(
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
        const { rejectionReason } = await req.json();

        const partner = await User.findById(partnerId);


        if (!partner || partner.role !== "partner") {
            return Response.json({ message: "partner  not found" }, { status: 404 });
        }

        if (!rejectionReason) {
            return Response.json({ message: "please enter rejection reason" }, { status: 400 });
        }

        if (partner.partnerStatus === "rejected") {
            return Response.json(
                { message: "partner already rejected" },
                { status: 400 });
        }

        partner.partnerStatus =  "rejected";
        partner.rejectionReason = rejectionReason ;

        await partner.save();

        return Response.json(
            { message: "partner rejected successfully" },
            { status: 200 }
        )
    } catch (error) {
        return Response.json(
            { message: `partner rejected error  ${error}` }
            , { status: 500 });
    }
}