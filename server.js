const express = require('express');
const conectarDB = require('./db'); // Importa a conexão com MongoDB

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco antes de iniciar o servidor
conectarDB();

app.get('/', (req, res) => {
  res.send('API rodando com MongoDB! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
