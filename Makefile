# Variables
DC = docker compose

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
	@ echo ""

help: intro
	@ echo "\033[1mUsage:\033[0m"
	@ echo ""
	@ awk 'BEGIN {FS = ":.*##";} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@ echo ""

up: intro ## Launch the project in the background
	@ if [ ! -f .env ]; then \
		echo "\033[1m\033[38;5;196mError: .env file not found\033[0m"; \
		exit 1; \
	fi
	@ if [ -z "$$(grep -E '^HOST_NAME=' .env)" ]; then \
		echo "HOST_NAME="`hostname -s` >> .env; \
	else \
		sed -i 's/^HOST_NAME=.*/HOST_NAME='`hostname -s`'/' .env; \
	fi
	@ $(DC) up -d --build

logs: ## Show the logs of the project
	@ $(DC) logs

down: intro ## Stop the project
	@ $(DC) down

clean: down ## Stop the project and remove all the stopped containers / unused networks / dangling images / unused build caches (docker system prune -f)
	@ docker system prune -f

.PHONY: all up down clean
