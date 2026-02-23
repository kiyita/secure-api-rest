import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

/**
 * Démarrage du serveur Express
 * Se connecte à la base de données avant de démarrer le serveur
 * Écoute sur le port défini dans les variables d'environnement ou 5000 par défaut
 * Affiche un message de confirmation lorsque le serveur est opérationnel
 */

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Server is listening on port ${PORT}`);
  });
};

startServer();