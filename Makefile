start:
	@docker compose start $(service)

stop:
	@docker compose stop $(service)

restart:
	@docker compose restart $(service)

up:
	@docker compose up -d

log:
	@docker compose logs -f $(service)

build:
	@docker compose build

shell:
	@docker compose run --rm --no-deps $(service) sh

prisma-studio:
	@docker compose exec backend sh -c "npm run db:studio"

psql:
	@docker compose exec postgres sh -c "su - postgres -c 'psql $(db)'"

pg_dump_structure:
	@docker compose exec postgres sh -c "su - postgres -c 'pg_dump --no-owner --schema-only $(db) > structure.sql'"
	docker cp optimus_exercitia_postgres:/var/lib/postgresql/structure.sql .
	docker compose exec postgres sh -c "rm /var/lib/postgresql/structure.sql"

pg_dump:
	@docker compose exec postgres sh -c "su - postgres -c 'pg_dump $(db) > $(file)'"
	docker cp optimus_exercitia_postgres:/var/lib/postgresql/$(file) .
	docker compose exec postgres sh -c "rm /var/lib/postgresql/$(file)"

pg_dump_restore:
	@make -i dropdb db=$(db)
	make createdb db=$(db)
	docker cp $(file) optimus_exercitia_postgres:/var/lib/postgresql/$(file)
	docker compose exec postgres sh -c "su - postgres -c 'psql -d $(db) -f $(file)'"
	docker compose exec postgres sh -c "rm /var/lib/postgresql/$(file)"

dropdb:
	@docker compose exec postgres sh -c "su - postgres -c 'dropdb $(db)'"

createdb:
	@docker compose exec postgres sh -c "su - postgres -c 'createdb $(db)'"

pg_get_remote_db:
	@make -i dropdb db=$(db)
	make createdb db=$(db)
	sh scripts/pgdump_remote.sh $(env) dump.psql
	docker cp dump.psql optimus_exercitia_postgres:/var/lib/postgresql/dump.psql
	docker compose exec postgres sh -c "su - postgres -c 'psql $(db) < dump.psql'"
	docker compose exec postgres sh -c "rm /var/lib/postgresql/dump.psql"
	rm dump.psql

ssh:
	@sh scripts/ssh_$(service).sh $(env)
