import { Controller, Post, Body, Get } from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags("Alerts")
@Controller("alerts")
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  /**
   * Set an alert based on the given criteria.
   * @param createAlertDto - The alert criteria
   * @returns The created alert details
   */
  @Post("set-alert")
  @ApiOperation({ summary: "Set Alert" })
  @ApiResponse({ status: 201, description: "Alert successfully created." })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        alertName: {
          type: "string",
          example: "Token Price Alert",
        },
        targetValue: {
          type: "number",
          example: 2360,
        },
        email: {
          type: "string",
          example: "hyperhire_assignment@hyperhire.in",
        },
        frequency: {
          type: "string",
          example: "Once",
        },
        notificationMethod: {
          type: "string",
          example: "email",
        },
      },
    },
  })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  /**
   * Get all user alerts.
   * @returns An array of user alerts
   */
  @Get()
  @ApiOperation({ summary: "Get  User Alerts" })
  @ApiResponse({ status: 200, description: "List of user alerts." })
  async getUserAlerts() {
    return this.alertsService.getUserAlerts();
  }
}
