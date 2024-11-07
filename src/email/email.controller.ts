import { Controller, Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";

@ApiTags("Email")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * SEND EMAIL
   */
  @Post("send")
  @ApiOperation({ summary: "Send Email" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "hyperhire_assignment@hyperhire.in",
        },
        subject: {
          type: "string",
          example: "Test Email",
        },
        message: {
          type: "string",
          example: "This is a test email",
        },
      },
    },
  })
  async sendEmail(
    @Body("email") email: string,
    @Body("subject") subject: string,
    @Body("message") message: string,
  ) {
    return this.emailService.sendEmail(email, subject, message);
  }
}
