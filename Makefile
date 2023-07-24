.PHONY: help
.DEFAULT_GOAL = help

CONTAINER = photolink

## —— Docker 🐳  ———————————————————————————————————————————————————————————————
docker-start: ## Iniciar Docker
	docker compose up -d

docker-down: ## Desligar Docker
	docker compose down

docker-rebuild-all: ## Rebuild em todos os containers
	docker compose down && docker compose up -d --build

docker-rebuild-postgres: ## Rebuild Postgres
	docker compose build --no-cache $(CONTAINER)-postgres

docker-shell: ## Acessar container do postgres
	docker container exec -it $(CONTAINER)-postgres bash

## —— Outros 🛠️️ ———————————————————————————————————————————————————————————————

help: ## Lista de commandos
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-24s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m## /[33m/' && printf "\n"
