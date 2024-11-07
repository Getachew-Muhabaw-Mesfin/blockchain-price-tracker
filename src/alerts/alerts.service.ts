import { Injectable } from "@nestjs/common";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Alert } from "./entities/alert.entity";
import { Repository } from "typeorm";
import { MoralisService } from "../moralis/moralis.service";
import { EmailService } from "src/email/email.service";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert) private alertRepository: Repository<Alert>,
    private moralisService: MoralisService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  /**
   * SET ALERT
   */
  async createAlert(createAlertDto: CreateAlertDto): Promise<Alert> {
    const newAlert = this.alertRepository.create({
      alertName: createAlertDto.alertName,
      chain: "eth",
      targetValue: createAlertDto.targetValue,
      frequency: createAlertDto.frequency,
      notificationMethod: createAlertDto.notificationMethod,
      email: createAlertDto.email,
      isNotify: false,
    });

    return this.alertRepository.save(newAlert);
  }

  /**
   * GET USER ALERTS
   */
  async getUserAlerts(): Promise<Alert[]> {
    return this.alertRepository.find();
  }

  /**
   * FETCH CHAIN ALERT
   */
  fetchChainAlert = async (chain: string) => {
    return this.alertRepository.find({
      where: {
        chain,
        isNotify: false,
      },
    });
  };

  /**
   * API - SETTING ALERT FOR SPECIFIC PRICe
   */
  async sendAutomaticEmails() {
    const alerts = await this.fetchChainAlert("eth");
    const ethAddress = this.configService.get<string>("ETH_CONTRACT_ADDRESS");
    for (const alert of alerts) {
      const tokenDetails = await this.moralisService.fetchTokenDetails(
        "0x1",
        ethAddress,
      );

      if (tokenDetails.usdPrice >= alert.targetValue && !alert.isNotify) {
        const response = await this.emailService.sendEmail(
          alert.email,
          `Alert: ${alert.alertName}`,
          `The price of ETH has reached ${alert.targetValue}`,
        );

        console.log(
          `Email sent to ${alert.email} because of ${alert.alertName}`,
        );
        if (response) {
          alert.isNotify = true;
          await this.alertRepository.save(alert);
        }
      }
    }
  }

  /**
   * AUTOMATICALLY SEND AN EMAIL TO “hyperhire_assignment@hyperhire.in”
   * IF THE PRICE OF A CHAIN INCREASES BY MORE THAN 3% COMPARED TO ITS PRICE ONE HOUR AGO
   */
  async checkPriceChainAndSendEmail() {
    const ethAddress = this.configService.get<string>("ETH_CONTRACT_ADDRESS");
    const pastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    try {
      const pastHourBlockNumber =
        await this.moralisService.getBlockNumberFromDate("0x1", pastHour);
      const pastHourPrice = await this.moralisService.fetchTokenDetails(
        "0x1",
        ethAddress,
        pastHourBlockNumber.block,
      );

      const etherPriceResponse = await this.moralisService.fetchTokenDetails(
        "0x1",
        ethAddress,
      );
      const etherUsdPrice = etherPriceResponse.usdPrice;

      const priceDifference = etherUsdPrice - pastHourPrice.usdPrice;
      const percentageDifference =
        (priceDifference / pastHourPrice.usdPrice) * 100;

      let emailSubject: string;
      let emailBody: string;

      if (percentageDifference > 3) {
        emailSubject = "Ethereum Price Alert: Increased by More than 3%";
        emailBody = `The price of Ethereum has increased by more than 3% compared to its price one hour ago. The price was $${pastHourPrice.usdPrice.toFixed(2)} and now it is $${etherUsdPrice.toFixed(2)}.`;
      } else {
        emailSubject = "Ethereum Price Update: No Significant Change";
        emailBody = `The price of Ethereum has not increased by more than 3% compared to its price one hour ago. The price was $${pastHourPrice.usdPrice.toFixed(2)} and now it is $${etherUsdPrice.toFixed(2)}. The difference is ${percentageDifference.toFixed(2)}%.`;
      }

      await this.emailService.sendEmail(
        "hyperhire_assignment@hyperhire.in",
        emailSubject,
        emailBody,
      );
    } catch (error) {
      console.error("Error checking price chain or sending email:", error);
    }
  }

  /**
   * AUTOMATICALLY SEND EMAILS EVERY 15 SECONDS
   * I MAKE 15 SECONDS FOR TESTING PURPOSE
   * YOU CAN CHANGE IT TO 15 MINUTES
   */
  // @Cron("*/15 * * * * *")
  @Cron("0 */5 * * * *")
  async handleCron() {
    await this.sendAutomaticEmails();
    await this.checkPriceChainAndSendEmail();
  }
}
