# Dockerfile
# Use a imagem oficial do node como base
FROM node:22-alpine

# Defina a pasta de trabalho no container
WORKDIR /app

COPY package*.json ./

# Instale o corepack
RUN corepack enable

# Defina o caminho do pnpm como uma variável de ambiente
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Instale as dependências do projeto usando a montagem de cache do BuildKit
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

COPY . .

# Exponha a porta 3000 do container
EXPOSE 3000

# Execute o comando para iniciar o servidor nextjs
CMD ["pnpm", "run", "dev"]