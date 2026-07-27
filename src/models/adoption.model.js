import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        adoptionDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export const AdoptionModel = mongoose.models.Adoption || mongoose.model("Adoption", adoptionSchema);


