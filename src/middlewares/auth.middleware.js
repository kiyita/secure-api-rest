import jwt from "jsonwebtoken";

/**
 * Middleware pour authentifier les requêtes en utilisant des tokens JWT.
 * 
 * Valide l'en-tête Authorization, extrait le token JWT,
 * le vérifie par rapport au secret JWT, et attache les informations
 * utilisateur décodées à l'objet requête.
 * 
 * @param {Object} req - Objet requête Express
 * @param {Object} req.headers - En-têtes de la requête
 * @param {string} req.headers.authorization - En-tête Authorization au format "Bearer <token>"
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction middleware Express suivante
 * @returns {void}
 * @throws {Error} Retourne 401 Non autorisé si:
 *   - L'en-tête Authorization est manquant
 *   - Le format de l'en-tête Authorization est invalide (pas "Bearer <token>")
 *   - Le token JWT est invalide ou expiré
 */
export const authMiddleware =   (req, res, next) => {
    try {
        // lire le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // vérifier le format "Bearer token"
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = parts[1];

        // vérifier le token avec jwt.verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // inhecter req.user
        req.user = { id: decoded.sub };

        next();
    } catch (error) {
        //token expiré ou invalide etc
        return res.status(401).json({ message: 'Unauthorized' });
    }  
};
        