import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
@Controller("healthcheck")
@ApiTags("API Health check")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "API  Health check" })
  @ApiResponse({ status: 200, description: "Server is up and running. " })
  getHello() {
    return this.appService.healthcheck();
  }
}
