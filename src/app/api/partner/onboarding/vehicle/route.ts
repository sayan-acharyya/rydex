import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";


const vehicleRegex = /^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{4}$/;

export async function POST(req: Request) {
    try {
        await connectDb();
        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json({ message: "unauthorized" }, { status: 400 })
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({ message: "user not found " },
                { status: 404 })
        }

        const { type, number, vehicleModel } = await req.json();

        if (!type || !number || !vehicleModel) {
            return Response.json({ message: "missing Required details" },
                { status: 400 })
        }

        if (!vehicleRegex.test(number)) {
            return Response.json({ message: "Invalid Vehicle Number Format" },
                { status: 404 })
        }



        const vehicleNumber = number.toUppercase();

        const duplicate = await Vehicle.findOne({ number: vehicleNumber })

        if (duplicate) {
            return Response.json({ message: "Vehicle already registered" },
                { status: 400 })
        }

        let vehicle = await Vehicle.findOne({ owner: session.user.id })

        if (vehicle) {
            vehicle.type = type
            vehicle.number = number
            vehicle.vehicleModel = vehicleModel
            vehicle.status = "pending"

            await vehicle.save();
            return Response.json(vehicle, { status: 200 })
        } else {
            vehicle = await Vehicle.create({
                type,
                number: vehicleNumber,
                vehicleModel
            })

            return Response.json(vehicle, { status: 201 })
        }


    } catch (error) {

    }
}
//9:45:55