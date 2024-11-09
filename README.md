# Optimus Exercitia

Best practices in Latin.

## Table Of Contents:

- [👷 Setup Project](#setup-project-just-what-the-docker-ordered)
- [📚 Libraries](docs/libraries.md)
- [🗄️ Project structure](docs/project-structure.md)
- [🙌 Best Practices](docs/best-practices.md)
- [👮 Security](docs/security.md)

## 👷 Setup Project (Just what the Docker ordered)

### Requirements

#### MacOS

- Have at least MacOS Monterey installed. This allows you to enable the new Virtualization framework which helps performance.
- Make sure you have Docker installed with [docker desktop](https://www.docker.com/products/docker-desktop/).
- Have [xcode](https://developer.apple.com/xcode/resources/) installed.

#### Linux

- You should already know what to do.

#### Windows

- Buy [this](https://www.apple.com/macbook-pro/).
- If you really want to check [this](https://docs.microsoft.com/en-us/windows/wsl/install).

### Get started

All the commands necessary to work with the containers are defined in the `Makefile`, so its not mandatory to know the Docker api by heart.

- **Create the containers:**

```shell
      make up
```

- **Install node modules:**

```shell
      make shell service=backend
      npm install
      exit

      make shell service=frontend
      npm install
      exit
```

- **Create `.env.development` and `.env.test` in `backend` based on `.env.default`** (See: [Env variables](#env-variables))
- **Create `.env` file in frontend based on the `.env.default`**
- **Optionally: create `scripts/env/dev.sh` and `scripts/env/prod.sh`.**
- **Create db's:**

```shell
      make shell service=backend
      npm run db:migrate:dev
      npm run db:migrate:test
      exit
```

- **Restart all services**

```shell
      make restart
```

- **Show logs of services**

```shell
      make log service=backend
      make log service=frontend
```

- **Create a user:**

```ssh
    make shell service=backend
    npm run command:dev create-user -- --first-name "John" --last-name "Doe" --email "john.doe@email.com" --password "test123"
```

- **Open your browser and visit** [http://localhost:3000](http://localhost:3000) **to access the frontend app**
- **Open your browser and visit** [http://localhost:3100/swagger](http://localhost:3100/swagger) **to access the endpoint documentation**

### Notes

- npm commands should be run inside the containers by running `make shell service=<service-name>`.

### Available commands

see `Makefile`, but here is a comprehensive list:

- `make start`: Starts the service, optionally can be passed specific service to start.
- `make stop`: Stops the service, optionally can be passed specific service to stop.
- `make restart`: Restarts the services, optionally can be passed specific service to restart.
- `make up`: Builds the docker containers and runs them.
- `make log`: Logs the services, can be passed specific service to log.
- `make build`: Builds the docker containers.
- `make shell service=<frontend | backend | postgres>`: Opens a shell
- `make pg_dump_structure db=<db-name>`: Dumps the db structure (no data) of the given db.
- `make pg_dump`: Dumps the entire db (including data) of the given db.
- `make pg_dump_restore file=<dump-file> db=<db-name>`: Drops the given db and recreates it with the given dump file.
- `make dropdb db=<db-name>`: Drops the given db.
- `make createdb db=<db-name>`: Creates the given db.

## Env variables

**Backend** uses these env variables

```sh
        DATABASE_URL=#Database connection URL you probably want to have an other database url in `.env.test` more info -> https://www.prisma.io/docs/guides/development-environment/environment-variables#example-set-the-database_url-environment-variable-in-an-env-file
        FRONTEND_URL=#URL of frontend application eg. http://localhost:3000
        SWAGGER_TITLE=#Title of the swagger page
        SWAGGER_DESCRIPTION=#Description of the swagger page
        SWAGGER_VERSION=#Your swagger api version
        JWT_SECRET_KEY=#Secret string used to sign access and refresh token. Can be a random fixed uuid for deployed environments. For local development a readable string - like "secret" - should suffice.
        JWT_ACCESS_TOKEN_EXPIRE_TIME=#Expiration time in seconds of the access token. For example,  300s is 5 min.
        JWT_REFRESH_TOKEN_EXPIRE_TIME=#Expiration time in seconds of the refresh token. For example, 604800 is 7 days.
        HTTP_COOKIE_REFRESH_TOKEN_NAME=#Name of the cookie that will hold the refresh token
        HTTP_COOKIE_EXPIRE_TIME=#Expiration time in seconds of the http cookies. Most of the time this should be the same as the JWT_REFRESH_TOKEN_EXPIRATION_TIME.
        HTTP_COOKIE_DOMAIN=#Defines the domain attribute of the http cookies. More info -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent
        HTTP_COOKIE_SAME_SITE=#Defines the SameSite attribute of the http cookies. More info -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
        LOG_SQL=#Set to true or false to show SQL queries in log
```

See [Security](docs/security.md) for more info about how the env variables are used.
