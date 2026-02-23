import jwt from "jsonwebtoken";

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
        