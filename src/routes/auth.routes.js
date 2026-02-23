import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

/**
 * Fichier de routes pour l'authentification
 * Contient les routes pour l'inscription, la connexion et la récupération des infos utilisateur
 * Utilise les contrôleurs définis dans auth.controller.js
 * Protège la route /me avec le middleware d'authentification
 */


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me); //protégée par middleware auth

export default router;