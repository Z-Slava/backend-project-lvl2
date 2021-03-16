install:
	npm ci

test:
	npm test -- --verbose

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .