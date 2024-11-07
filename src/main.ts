import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const PORT = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1.0");

  /**
   *
   * Swagger API Documentation Setup
   */
  const config = new DocumentBuilder()
    .setTitle("Blockchain Price Tracker API")
    .setDescription(
      "API for tracking Ethereum and Polygon prices, alerts, and swap rates.",
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api-docs", app, document);

  await app.listen(PORT);
  console.log(
    `-----------------Server is running on PORT:${PORT}-----------------------------`,
  );
  console.log(
    `-----------------Swagger is available at http://localhost:${PORT}/api-docs`,
  );
}
bootstrap();
