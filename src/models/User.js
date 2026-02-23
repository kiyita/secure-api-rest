import mongoose from "mongoose";

/**
 * Schéma Utilisateur
 * Définit la structure et les règles de validation pour les documents utilisateur dans la base de données.
 * 
 * @typedef {Object} User
 * @property {string} email - Adresse e-mail de l'utilisateur. Doit être unique, en minuscules et trimé.
 * @property {string} password - Mot de passe de l'utilisateur. Doit contenir au moins 8 caractères.
 * @property {Date} createdAt - Heure date de la création de l'utilisateur (généré automatiquement).
 * @property {Date} updatedAt - Heure date de la dernière mise à jour de l'utilisateur (généré automatiquement).
 * 
 * @type {mongoose.Model<User>}
 */
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
    },
    {timestamps: true}
);

export default mongoose.model('User', userSchema);