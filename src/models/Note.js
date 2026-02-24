import mongoose from "mongoose";

/**
 * Schéma Note 
 * Définit la structure des notes utilsateurs
 */

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true } // ajout des timestamps createdAt et updatedAt
);

export default mongoose.model('Note', noteSchema);