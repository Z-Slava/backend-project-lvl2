install:
	npm ci

test:
	npm test -- --verbose

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .