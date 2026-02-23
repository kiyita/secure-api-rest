import bycrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { db } from '../switch.js';

/**
 * Enregistrer un nouvel utilisateur avec email et mot de passe
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Adresse email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur (minimum 8 caractères)
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @returns {Promise<void>} Réponse JSON avec les données utilisateur ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si l'opération de base de données échoue
 */
export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // validation minimale 
        if (!email || !password || password.length < 8) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        //vérif si déjà existant
        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Unable to process request' });
        }

        //hash du mot de passe
        const hashedPassword = await bycrypt.hash(password, 12);

        //créer user
        const user = await db.createUser(email.toLowerCase(), hashedPassword);

        // réponse sans password
        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        return next(error);
    }
};



/**
 * Authentifier l'utilisateur et générer un token JWT d'accès
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Adresse email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @returns {Promise<void>} Réponse JSON avec token JWT d'accès ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si l'authentification échoue
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // validation minimale
        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        //vérif si utilisateur existe
        const user = await db.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //comparer mdp brut et hash
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //générer token JWT court
        const accessToken = jwt.sign(
            {sub: user._id.toString()}, //payload minimal
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || "15m"} //token court
        );

        return res.status(200).json({accessToken});
    } catch (error) {
        return next(error);
    }
};


/**
 * Récupérer le profil de l'utilisateur authentifié actuel
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.user - Objet utilisateur authentifié du middleware
 * @param {string} req.user.id - ID de l'utilisateur depuis le token JWT
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @returns {Promise<void>} Réponse JSON avec les données de profil utilisateur ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si l'opération de base de données échoue
 */
export const me = async (req, res, next) => {
    try {
        //req.user.id vient du middleware auth
        const user = await db.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ 
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        return next(error);
    }   
};