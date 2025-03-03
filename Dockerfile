# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta da aplicação
EXPOSE 3006

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
