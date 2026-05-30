import connectDb from "@/lib/db";
import Contact from "@/models/contact.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Message id is required",
        },
        {
          status: 400,
        }
      );
    }

    await Contact.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      {
        status: 500,
      }
    );
  }
}