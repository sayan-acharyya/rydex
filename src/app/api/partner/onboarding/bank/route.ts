import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
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
            return Response.json({ message: "User not found" },
                { status: 404 });
        }

        const { accountHolder, accountNumber, ifsc, upi, mobileNumber } = await req.json();

        if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
            return Response.json({ message: "fill all bank details" },
                { status: 400 });
        }

        const partnerBank = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            {
                accountHolder,
                accountNumber,
                ifsc,
                upi,
                status: "added"
            },
            { upsert: true, new: true }
        )

        user.mobileNumber = mobileNumber;
        if (user.partnerOnBoardingSteps < 3) {
            user.partnerOnBoardingSteps = 3;
        }
        await user.save();

        return Response.json(partnerBank, { status: 201 });

    } catch (error) {
        return Response.json(
            { message: `partner bank post error ${error}` }
            , { status: 500 });
    }
}


export async function GET(req: NextRequest) {
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
            return Response.json({ message: "User not found" },
                { status: 404 });
        }

        const partnerBank = await PartnerBank.findOne({ owner: user._id })

        if (partnerBank) {
            return Response.json(partnerBank, { status: 200 });
        } else {
            return null;
        }
    } catch (error) {
        return Response.json(
            { message: `get partner bank error ${error}` }
            , { status: 500 });
    }
}