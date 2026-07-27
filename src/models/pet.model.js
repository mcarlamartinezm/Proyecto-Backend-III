import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        species: {
            type: String,
            required: true,
            default: "Perro"
        },
        age: {
            type: Number,
            default: 0
        },
        adopted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const PetModel = mongoose.models.Pet || mongoose.model("Pet", petSchema);