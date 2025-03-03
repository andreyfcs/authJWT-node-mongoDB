require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { User } = require('./db'); // Importa User do db.js

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acesso negado, token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
};

// Rota para registro de usuário
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'E-mail já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
});

// Rota para login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'E-mail ou senha inválidos' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'E-mail ou senha inválidos' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login bem-sucedido', token });
});

// Rota protegida
app.get('/dashboard', authenticateJWT, (req, res) => {
    res.json({ message: `Bem-vindo, usuário ${req.user.email}!` });
});

// Iniciando o servidor
app.listen(3006, () => console.log('Servidor rodando na porta 3001'));











































