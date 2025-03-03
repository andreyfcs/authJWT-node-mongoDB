const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'seuSegredoSuperSecreto'; // Mantenha seguro no .env

mongoose.connect('mongodb://admin:admin123@localhost:27017/auth_system?authSource=admin')
    .then(() => console.log("MongoDB conectado!"))
    .catch(err => console.error("Erro ao conectar:", err));

// Definição do esquema do usuário
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', UserSchema);

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

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'E-mail já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
});

// Rota para login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'E-mail ou senha inválidos' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'E-mail ou senha inválidos' });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login bem-sucedido', token });
});

// Rota protegida
app.get('/dashboard', authenticateJWT, async (req, res) => {
    res.json({ message: `Bem-vindo, usuário ${req.user.email}!` });
});

// Iniciando o servidor
app.listen(3001, () => console.log('Servidor rodando na porta 3000'));

