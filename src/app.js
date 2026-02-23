import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

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

export default app;