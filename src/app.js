import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';

/** Démarrage de l'application Express */

const app = express();

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
app.use(express.static('public'));

//test si API fonctionne
app.get("/", (req, res) => {
  res.status(200).json({ message: "API OK" });
});

app.get('/tester', (req, res) => {
  res.redirect('/tester.html');
});

app.use('/api/auth', authRoutes);

app.use('/api/notes', noteRoutes);

export default app;