import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PricesModule } from "./prices/prices.module";
import { AlertsModule } from "./alerts/alerts.module";
import { MoralisService } from "./moralis/moralis.service";
import { EmailService } from "./email/email.service";
import { EmailController } from "./email/email.controller";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: parseInt(configService.get("POSTGRES_PORT"), 10),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true, // TODO: Disable this in production
      }),
    }),
    ScheduleModule.forRoot(),
    PricesModule,
    AlertsModule,
    EmailModule,
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, MoralisService, EmailService],
})
export class AppModule {}
