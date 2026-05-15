import mongoose from "mongoose";

// -------------------- TYPES --------------------

export type BookingStatus = "idle"
    | "requested"
    | "awaiting_payment"
    | "confirmed"
    | "started"
    | "completed"
    | "cancelled"
    | "rejected"
    | "expired";

export type PaymentStatus = "pending" | "paid" | "cash" | "failed";

export interface IBooking {
    user: mongoose.Types.ObjectId;
    driver: mongoose.Types.ObjectId;
    vehicle: mongoose.Types.ObjectId;

    pickUpAddress: string;
    dropAddress: string;

    pickUpLocation: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };

    dropLocation: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };

    fare: number;

    userMobileNumber: string;
    driverMobileNumber: string;

    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentDeadline: Date;

    adminCommission: number;
    partnerAmount: number;

    pickUpOtp?: string;
    pickUpOtpExpires?: Date;

    dropOtp?: string;
    dropOtpExpires?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

// -------------------- SCHEMA --------------------

const bookingSchema = new mongoose.Schema<IBooking>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },

        pickUpAddress: {
            type: String,
            required: true,
        },

        dropAddress: {
            type: String,
            required: true,
        },

        pickUpLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (val: number[]) => val.length === 2,
                    message: "pickUpLocation must be [lng, lat]",
                },
            },
        },

        dropLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (val: number[]) => val.length === 2,
                    message: "dropLocation must be [lng, lat]",
                },
            },
        },

        fare: {
            type: Number,
            required: true,
        },

        userMobileNumber: {
            type: String,
            required: true,

        },

        driverMobileNumber: {
            type: String,
            required: true,

        },

        bookingStatus: {
            type: String,
            enum: [
                "requested",
                "awaiting_payment",
                "confirmed",
                "started",
                "completed",
                "cancelled",
                "rejected",
                "expired",
                "idle"
            ],
            default: "idle",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "cash", "failed"],
            default: "pending",
        },

        paymentDeadline: {
            type: Date
        },

        adminCommission: {
            type: Number,
            default: 0,
        },

        partnerAmount: {
            type: Number,
            default: 0,
        },

        pickUpOtp: {
            type: String,
            default: null,
        },

        pickUpOtpExpires: {
            type: Date,
            default: null,
        },

        dropOtp: {
            type: String,
            default: null,
        },

        dropOtpExpires: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// -------------------- INDEXES --------------------

// Required for geospatial queries (nearest driver, etc.)
bookingSchema.index({ pickUpLocation: "2dsphere" });
bookingSchema.index({ dropLocation: "2dsphere" });

// -------------------- MODEL --------------------

const Booking =
    mongoose.models.Booking ||
    mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;