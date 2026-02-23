import bycrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from '../models/User.js';

// Contrôleur pour l'inscription d'un utilisateur
export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // validation minimale 
        if (!email || !password || password.length < 8) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        //vérif si déjà existant
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Unable to process request' });
        }

        //hash du mot de passe
        const hashedPassword = await bycrypt.hash(password, 12);

        //créer user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
        });

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

// Controlleur pour la connexion d'un utilisateur
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // validation minimale
        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        //vérif si utilisateur existe
        const user = await User.findOne({ email: email.toLowerCase() });

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
