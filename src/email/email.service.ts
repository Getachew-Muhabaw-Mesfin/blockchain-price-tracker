import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  /**
   * MAILTRAP EMAIL SERVICE CONFIGURATION
   */
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("MAILTRAP_HOST"),
      port: this.configService.get<number>("MAILTRAP_PORT"),
      auth: {
        user: this.configService.get<string>("MAILTRAP_USERNAME"),
        pass: this.configService.get<string>("MAILTRAP_PASSWORD"),
      },
    });
  }

  /**
   * SEND EMAIL HELPER FUNCTION
   */
  async sendEmail(email: string, subject: string, message: string) {
    const mailOptions = {
      from: '"Getachew Muhabaw" <getachewmuhabaw@gmail.com>',
      to: email,
      subject: subject,
      text: message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent successfully!" };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
