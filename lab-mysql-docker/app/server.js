const express = require('express');
const session = require('express-session');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const exigirLogin = require('./middlewares/auth');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'segredo-lab',
    resave: false,
    saveUninitialized: false
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/usuarios', exigirLogin, usuariosRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
