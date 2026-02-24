import { db } from '../switch.js';

/** 
 * Créer une nouvelle note pour l'utilisateur authentifié
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.title - Titre de la note
 * @param {string} req.body.content - Contenu de la note
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @returns {Promise<void>} Réponse JSON avec la note créée ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si la création de la note échoue
*/
export const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        //vérif si la note est valide
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        //créer la note
        const note = await db.createNote(req.user.id, title, content);

        //réponse
        return res.status(201).json({
            message: 'Note created successfully',
            note: {
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
            },
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Récupérer toutes les notes de l'utilisateur authentifié
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.user - Objet utilisateur authentifié ajouté par le middleware d'authentification
 * @param {string} req.user.id - ID de l'utilisateur authentifié
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON avec la liste des notes ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si la récupération des notes échoue
 * */
export const getNotes = async (req, res, next) => {
    try {
        //récupérer les notes de l'utilisateur
        const notes = await db.getNotesByUserId(req.user.id);
        return res.status(200).json({ notes });
    } catch (error) {
        return next(error);
    }
};

/**
 * Récupérer une note spécifique de l'utilisateur authentifié
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.user - Objet utilisateur authentifié ajouté par le middleware d'authentification
 * @param {string} req.user.id - ID de l'utilisateur authentifié
 * @param {string} req.params.id - ID de la note à récupérer
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @returns {Promise<void>} Réponse JSON avec la note ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si la récupération échoue
 * */
export const getNoteById = async (req, res, next) => {
    try {
        const noteId = req.params.id;

        const note = await db.getNoteByIdAndUserId(noteId, req.user.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({ note });
    } catch (error) {
        return next(error);
    }
};

/**
 * Mettre à jour une note existante de l'utilisateur authentifié
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.user - Objet utilisateur authentifié
 * @param {string} req.params.id - ID de la note à mettre à jour
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.title - Nouveau titre
 * @param {string} req.body.content - Nouveau contenu
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Réponse JSON avec la note mise à jour ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si la mise à jour échoue
*/
export const updateNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const { title, content } = req.body;
        
        //vérif si la note est valide
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

         const updatedNote = await db.updateNoteByIdAndUserId(noteId, req.user.id, title, content);

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({
            message: 'Note updated successfully',
            note: {
                id: updatedNote._id,
                title: updatedNote.title,
                content: updatedNote.content,
                createdAt: updatedNote.createdAt,
                updatedAt: updatedNote.updatedAt,
            },
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Supprimer une note existante de l'utilisateur authentifié
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.user - Objet utilisateur authentifié
 * @param {string} req.params.id - ID de la note à supprimer
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Réponse JSON avec confirmation de suppression ou message d'erreur
 * @throws {Error} Transmis au middleware suivant si la suppression échoue
 */
export const deleteNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        
        const deletedNote = await db.deleteNoteByIdAndUserId(noteId, req.user.id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({
            message: 'Note deleted successfully',
            note: {
                id: deletedNote._id,
                title: deletedNote.title,
                content: deletedNote.content,
                createdAt: deletedNote.createdAt,
            },
        });
    } catch (error) {
        return next(error);
    }
};