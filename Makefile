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
	@ echo ""

help: intro
	@ echo "\033[1mUsage:\033[0m"
	@ echo ""
	@ awk 'BEGIN {FS = ":.*##";} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@ echo ""

up: intro ssl-certs ## Launch the project in the background
	@ if [ ! -f .env ]; then \
		echo "\033[1m\033[38;5;196mError: .env file not found\033[0m"; \
		exit 1; \
	fi
	@ if [ -z "$$(grep -E '^HOST_NAME=' .env)" ]; then \
		echo "HOST_NAME=$(HOSTNAME)" >> .env; \
	else \
		sed -i 's/^HOST_NAME=.*/HOST_NAME=$(HOSTNAME)/' .env; \
	fi
	@ $(DC) up -d --build

logs: ## Show the logs of the project
	@ $(DC) logs

down: intro ## Stop the project
	@ $(DC) down

clean: down ## Stop the project and remove all the stopped containers / unused networks / dangling images / unused build caches (docker system prune -f)
	@ docker system prune -f

ssl-certs: ## Generate SSL certificates if not present
	@ if [ ! -d $(CERT_DIR) ]; then \
		mkdir -p $(CERT_DIR); \
	fi
	@ if [ ! -f $(CERT_DIR)/server.crt ] || [ ! -f $(CERT_DIR)/server.key ]; then \
		echo "Generating SSL certificates..."; \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout $(CERT_DIR)/server.key -out $(CERT_DIR)/server.crt \
			-subj "/CN=$(HOSTNAME)" \
			-addext "subjectAltName=DNS:$(HOSTNAME),DNS:localhost,IP:127.0.0.1"; \
		echo "SSL certificates generated."; \
	else \
		echo "SSL certificates already exist."; \
	fi

.PHONY: all up down clean ssl-certs
