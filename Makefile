.PHONY: setup test help

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  setup   Configure local git hooks (run once after cloning)"
	@echo "  test    Run the React tests once (same as CI)"

setup:
	git config core.hooksPath .githooks
	@echo "Git hooks configured. (.githooks/commit-msg, .githooks/pre-push are now active)"

test:
	CI=true npm test -- --watchAll=false
