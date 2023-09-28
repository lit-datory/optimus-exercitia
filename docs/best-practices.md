# 🙌 Best Practices

It is recommended while working on this codebase that best practices are followed. Here are some guidelines outlined to achieve this.

## General rules of thumb
- Write code that is easy to delete, not to extend.
- Avoid assigning variables with `let` and try to use higher order functions like `.map` and `.reduce` when operating data structures; this will prevent silent mutations of arrays and objects. Javascript's objects and therefore arrays are reference types. By creating new objects a lot of subtle bugs will be avoided.
- Write code that is testable. Testable code is often good code.

## Naming Conventions

### Names

- Use PascalCase for type names.
- Use PascalCase for class names.
- Use PascalCase for enum values.
- Use camelCase for function names.
- Use camelCase for method names.
- Use camelCase for properties and variables.
- Controller names should be plural when possible.
- Column names in the database should be snake_case. This avoids having to add quotes `(")` around them when querying with postgreSQL.

### File names

- Filenames in general should be in camelCase.
- Filenames of React components (`.tsx`) should be in PascalCase.
- Files that include only types should end with `.types.ts`
- Filenames for **backend** should include the subject split by a dot (`.`). For instance, a controllers file name becomes `<name>.controller.ts`, a service name will be `<name>.service.ts` etc.
- Filenames for specs should include the filename and end with `.spec`. So a spec for a service becomes `<name>.service.spec.ts`.

## Imports/Exports

- **Strongly recommended** to only use named exports.
- When creating new directories; it is recommended to export public code in the `index.ts` file.
- **Strongly recommended** to use absolute imports when appropriate.

## Endpoints
- Every incoming request should be parsed ([Zod](https://zod.dev/)).
- Every outging response should be parsed ([Zod](https://zod.dev/)).
- Endpoints should have correct swagger documentation by using ([Zod](https://zod.dev/)) schemas; this wil make the consumers of our endpoints api.
- HTTP code 500 throws should never happen. Catch them!

## Types

- Data coming from requests should be typed by a parsed output from ([Zod](https://zod.dev/)); this will make the typings throughout the codebase automatically correct.
- Type files should end with `.type.ts`

## Tests (specs)

- It is expected to have a broad test suite that covers most of the critical paths of the codebase.
- Tests not only avoid regression, but serve as documentation as well.
- Have more integration tests than unit tests; it allows code refactoring to be easier.
- Use descriptive and structured `describe` and `it` blocks to define tests.
- Use factories `backend/src/factories` in **backend** to generate or mock data; this keeps our test cases concise and focused.
- Every endpoint action should have an end to end test.
- Every HTTP code the endpoint can throw should have a test case.
- Test files should end with `.spec.ts`
- End to end test files end with `e2e-spec.ts`

## Code documentation & comments

- Code should be self documenting.
- Tests are the main documentation of the codebase. Write them!
