import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';

/** Démarrage de l'application Express */

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de sécurité avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Middleware pour parser le JSON avec une limite de taille
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//test si API fonctionne
app.get("/", (req, res) => {
  res.status(200).json({ message: "API OK" });
});

app.get('/tester', (req, res) => {
  res.redirect('/tester.html');
});

app.get('/connexion', (req, res) => {
  res.render('connexion');
});

app.get('/notes', (req, res) => {
  res.render('notes');
});

app.use('/api/auth', authRoutes);

app.use('/api/notes', noteRoutes);

export default app;