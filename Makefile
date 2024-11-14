# Variables
DC = docker compose
CERT_DIR = certs
HOSTNAME := $(shell hostname -s)

all: up

intro:
	@ echo ""
	@ echo "\033[38;5;39m:::::::::   ::::::::  ::::    :::  ::::::::"
	@ echo "\033[38;5;39m:+:    :+: :+:    :+: :+:+:   :+: :+:    :+:"
	@ echo "\033[38;5;75m+:+    +:+ +:+    +:+ :+:+:+  +:+ +:+"
	@ echo "\033[38;5;111m+#++:++#+  +#+    +:+ +#+ +:+ +#+ :#:"
	@ echo "\033[38;5;147m+#+        +#+    +#+ +#+  +#+#+# +#+   +#+#"
	@ echo "\033[38;5;183m#+#        #+#    #+# #+#   #+#+# #+#    #+#"
	@ echo "\033[38;5;219m###         ########  ###    ####  ########"
	@ echo "\033[0m"

help: intro
	@ echo "\033[1mUsage:\033[0m"
	@ echo ""
	@ awk 'BEGIN {FS = ":.*##";} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@ echo ""

up: intro ## Launch the project in the background
	@ if [ ! -f .env ]; then \
		echo "\033[1m\033[38;5;196mError: .env file not found\033[0m"; \
		exit 1; \
	fi
	@ if [ -z "$$(grep -E '^HOST_NAME=' .env)" ]; then \
		echo "HOST_NAME=$(HOSTNAME)" >> .env; \
	else \
		if [ "$$(uname)" = "Darwin" ]; then \
			sed -i '' -E 's/^HOST_NAME=.*/HOST_NAME=$(HOSTNAME)/' .env; \
		else \
			sed -i 's/^HOST_NAME=.*/HOST_NAME=$(HOSTNAME)/' .env; \
		fi; \
	fi
	@ $(DC) up -d --build

logs: intro ## Show the logs of the project
	@ $(DC) logs -f

logs-backend: intro ## Show the logs of the backend
	@ docker logs ft_transcendence-backend-1 -f

logs-frontend: intro ## Show the logs of the frontend
	@ docker logs ft_transcendence-frontend-1 -f

logs-harvester: intro ## Show the logs of the harvester
	@ docker logs ft_transcendence-harvester-1 -f

logs-postgres: intro ## Show the logs of the database
	@ docker logs ft_transcendence-postgres-1 -f

logs-statcruncher: intro ## Show the logs of the statcruncher
	@ docker logs ft_transcendence-statcruncher-1 -f

down: intro ## Stop the project
	@ $(DC) down

clean: down ## Stop the project and remove all the stopped containers / unused networks / dangling images / unused build caches (docker system prune -f)
	@ docker system prune -f

cleanv: down ## Stop the project and remove all the volumes
	@ docker volume prune -af
	@ rm -rf data_*

fclean: cleanv ## Stop the project and remove all the stopped containers / unused networks / dangling images / unused build caches / volumes
	@ docker system prune -af

.PHONY: all up down clean
