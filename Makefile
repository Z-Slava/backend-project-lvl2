install:
	npm ci

test:
	npm test -- --verbose

test-nested:
	npm test -- -t=#nested

test-flat:
	npm test -- -t=#flat

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .