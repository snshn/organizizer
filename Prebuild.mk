#!/usr/bin/make -f

INSTALL_DEPS: ## Install required dependencies
	@cd app && meteor npm install
	@cd app && NODE_TLS_REJECT_UNAUTHORIZED=0 meteor build ../output
.PHONY: INSTALL_DEPS
