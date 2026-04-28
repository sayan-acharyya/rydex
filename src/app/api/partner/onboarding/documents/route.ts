import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
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

        const formdata = await req.formData();
        const aadhar = formdata.get("aadhar") as Blob | null
        const license = formdata.get("license") as Blob | null
        const rc = formdata.get("rc") as Blob | null

        if (!aadhar || !license || !rc) {
            return Response.json({ message: "all documents are required" },
                { status: 404 });

        }

        const updatePayload: any = {
            status: "pending"
        }

        if (aadhar) {
            const url = await uploadOnCloudinary(aadhar)
            if (!url) {
                return Response.json({ message: "aadhar upload failed" },
                    { status: 500 });
            }
            updatePayload.aadharUrl = url
        }

        if (license) {
            const url = await uploadOnCloudinary(license)
            if (!url) {
                return Response.json({ message: "license upload failed" },
                    { status: 500 });
            }
            updatePayload.licenseUrl = url
        }

        if (rc) {
            const url = await uploadOnCloudinary(rc)
            if (!url) {
                return Response.json({ message: "RC upload failed" },
                    { status: 500 });
            }
            updatePayload.rcUrl = url
        }

        const partnerDocs = await PartnerDocs.findByIdAndUpdate(
            { owner: user._id },
            { $set: updatePayload },
            { upsert: true, new: true }
        )

        if (user.partnerOnBoardingSteps < 2) {
            user.partnerOnBoardingSteps = 2;
        }

        await user.save();

        return Response.json(partnerDocs, { status: 201 });

    } catch (error) {
        return Response.json(
            { message: `partner docs error ${error}` }
            , { status: 500 });

    }
}


 