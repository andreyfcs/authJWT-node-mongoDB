# Usar a imagem oficial do Node.js
FROM node:18

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos necessários
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código para o container
COPY . .

# Expor a porta definida no .env
EXPOSE 3095

# Comando para iniciar o app
CMD ["npm", "start"]
