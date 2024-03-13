# Makefile
# Defina as variáveis do projeto
DOCKER_COMPOSE_FILE = docker-compose.yaml

install:
	pnpm install

setup:
	pnpm install && docker-compose -f $(DOCKER_COMPOSE_FILE) up -d --build

down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

dev:
	pnpm run dev

run: 
	docker-compose up