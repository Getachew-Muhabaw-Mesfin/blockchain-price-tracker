import { Module } from "@nestjs/common";
import { PricesService } from "./prices.service";
import { PricesController } from "./prices.controller";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Price } from "./entities/price.entity";
import { Alert } from "../alerts/entities/alert.entity";
import { MoralisService } from "../moralis/moralis.service";
import { EmailService } from "src/email/email.service";
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Price, Alert])],
  controllers: [PricesController],
  providers: [PricesService, MoralisService, EmailService],
})
export class PricesModule {}
