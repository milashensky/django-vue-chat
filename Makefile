all: install migrate client

install:
	@pip install -Ur requirements/base.txt

migrate:
	@python ./manage.py migrate

client:
	@cd client && yarn install && yarn run release && cd -
