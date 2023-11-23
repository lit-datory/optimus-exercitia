# 🗄️ Project Structure

The **backend** code lives in the `backend` directory and looks like this:
``` sh
        prisma              # includes prisma's schema file and database migrations
        |
        src
        |
        +-- auth            # module containing all authentication/authorization logic.
        |
        +-- commander       # module containing commands logic.
        |
        +-- config          # module holding all configuration settings. (env parsing etc.)
        |
        +-- factories       # module that includes all the factories to use in specs.
        |
        +-- health          # this module exposes monitoring tools like a /health endpoint
        |
        +-- main            # includes bootstrap code that wraps everything together
        |
        +-- prisma          # module that wraps Prisma ORM into a PrismaService to be consumed by other modules.
        |
        +-- app             # module containing app business logic CRUD
        |
        +-- utils           # utility functions!
        |
        +-- zod             # module expoinsg @UseSchema decorator to be used in combination with controller methods
        |
        +-- app.module.ts   # imports all other modules
        |
        test                # contains all end to end enpoint tests
```
The frontend code lives in the `frontend` directory and its structure is mostly inspired from:

[Bulletproof React](https://github.com/alan2207/bulletproof-react)

But here are the main takeaways:
```sh
        src
        |
        +-- assets            # assets folder can contain all the static files such as images, fonts, etc.
        |
        +-- components        # shared components used across the entire application
        |
        +-- config            # all the global configuration, env variables etc. get exported from here and used in the app
        |
        +-- features          # feature based modules
        |
        +-- hooks             # shared hooks used across the entire application
        |
        +-- lib               # re-exporting different libraries preconfigured for the application
        |
        +-- providers         # all of the application providers
        |
        +-- routes            # routes configuration
        |
        +-- stores            # global state stores
        |
        +-- test              # test utilities and mock server
        |
        +-- types             # base types used across the application
        |
        +-- utils             # shared utility functions
```

A feature could have the following structure:

```sh
        src/features/awesome-feature
        |
        +-- api         # exported API request declarations and api hooks related to a specific feature
        |
        +-- assets      # assets folder can contain all the static files for a specific feature
        |
        +-- components  # components scoped to a specific feature
        |
        +-- hooks       # hooks scoped to a specific feature
        |
        +-- routes      # route components for a specific feature pages
        |
        +-- stores      # state stores for a specific feature
        |
        +-- types       # typescript types for TS specific feature domain
        |
        +-- utils       # utility functions for a specific feature
        |
        +-- index.ts    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```
