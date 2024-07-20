import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { INestApplication } from "@nestjs/common"
import { ConfigService } from "src/config/services/config.service"

export default function swagger(app: INestApplication) {
  const configService = app.get(ConfigService)

  const title = configService.get("SWAGGER_TITLE")
  const description = configService.get("SWAGGER_DESCRIPTION")
  const version = configService.get("SWAGGER_VERSION")

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: "http",
        in: "Header",
        scheme: "Bearer",
      },
      "accessToken",
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("swagger", app, document)
}
