import { Router } from "express";
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from "../controllers/note.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

/**
 * Fichier de routes pour les notes
 * Contient les routes pour la création, la récupération, la mise à jour et la suppression des notes
 * Utilise les contrôleurs définis dans note.controller.js
 * Protège toutes les routes avec le middleware d'authentification
 */


const router = Router();

router.get("/notes", authMiddleware, getNotes);
router.post("/notes", authMiddleware, createNote);
router.get("/notes/:id", authMiddleware, getNoteById);
router.put("/notes/:id", authMiddleware, updateNote);
router.delete("/notes/:id", authMiddleware, deleteNote);

export default router;