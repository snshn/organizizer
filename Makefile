#!/usr/bin/make -f

SRC_DIR ?= src
DOCKER ?= $(if $(shell docker -v 2> /dev/null),docker,podman)
DOCKER_IMAGE_TAG ?= snshn/organizizer
PORT ?= 3000

.DEFAULT_GOAL := help

all: run
.PHONY: all

# include Prebuild.mk

help: ## Show this helpful message
	@for ML in $(MAKEFILE_LIST); do \
		grep -E '^[a-zA-Z_-]+:.*?## .*$$' $$ML | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'; \
	done
.PHONY: help

run: ## Run web app using containers
	@$(DOCKER) build -t $(DOCKER_IMAGE_TAG) .
	@$(DOCKER) run -it --rm -p 3000:$(PORT) -v `pwd`/app/.meteor:/home/mt/app/.meteor -v `pwd`/app/client:/home/mt/app/client -v `pwd`/app/public:/home/mt/app/public -v `pwd`/app/server:/home/mt/app/server $(DOCKER_IMAGE_TAG)
.PHONY: run

RUN: ## Run web app
	@cd app && NODE_TLS_REJECT_UNAUTHORIZED=0 meteor run --port=3000
.PHONY: RUN

tunnel: ## Enter container shell
	@$(DOCKER) run -it --rm $(DOCKER_IMAGE_TAG) sh || true
.PHONY: tunnel

update: ## Update app's code to use the latest version of Meteor using containers
	@$(DOCKER) run -it --rm -v `pwd`/app/.meteor:/home/mt/app/.meteor -v `pwd`/app/client:/home/mt/app/client -v `pwd`/app/public:/home/mt/app/public -v `pwd`/app/server:/home/mt/app/server $(DOCKER_IMAGE_TAG) -c "make UPDATE"
.PHONY: update

UPDATE: ## Update app's code to use the latest version of Meteor
	@cd app && NODE_TLS_REJECT_UNAUTHORIZED=0 meteor update
.PHONY: UPDATE
