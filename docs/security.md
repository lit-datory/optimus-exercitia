# 👮 Security

This project includes a basic login flow to expand further on in future projects.
The `auth` module in the backend (`backend/src/auth`) exposes 3 endpoints:

- `/auth/login`
- `/auth/refresh_token`
- `/auth/logout`

These endpoints will always return a `401` when something goes wrong; this is a security measure to make sure no info will leak.

## Authentication

- To authentication with the endpoint the `/auth/login` endpoint should be used with a JSON body of:

  ```json
  { "email": "<email>", "password": "<password>" }
  ```

- Whenever a user is blocked the `/auth/login` endpoint will return a `401`.
- When successfully authenticated; the endpoint will return a JSON body with an access token.
- The access token is a [JWT token](https://jwt.io/introduction) with the `id` and `email` of the user as payload.
- The expiration time of the access token is configured via the `JWT_ACCESS_TOKEN_EXPIRE_TIME` env variable (See: [Env variables](https://github.com/lit-datory/optimus-exercitia#env-variables)), and is defined in seconds.
- The secret signing key of the access token is configured via the `JWT_SECRET_KEY`.
- A cookie holding a refresh token ([JWT token](https://jwt.io/introduction)) is included in the response after using the `/auth/login` endpoint to authenticate.
  - Expiration date can be configured via the `JWT_REFRESH_TOKEN_EXPIRE_TIME` env variable.
  - Name of the cookie can be configured via `HTTP_COOKIE_REFRESH_TOKEN_NAME` env variable.
- The refresh token includes the `id` of the `refresh_token_state` inside the database.
- Calling `/auth/logout` endpoint will remove the session from the `refresh_token_states` table in the database.
- `/auth/logout` will always return 200 since you should always be able to logout and remove request cookies.

## Authorization

- Endpoints that are protected should be authorized with the access token via the `Authorization` header and should be included as `Bearer <accessToken>`.
- An access token can expire. Use `/auth/refresh_token` endpoint to retrieve a new one.
  - `/auth/refresh_token` will read the refresh token cookie value. The endpoint will return a new access token when a valid `refresh_token_state` in the database is present.
  - When a user is blocked the endpoint will return a 401.
