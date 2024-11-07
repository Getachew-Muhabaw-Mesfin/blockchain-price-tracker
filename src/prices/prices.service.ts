import { Injectable } from "@nestjs/common";
import { Price } from "./entities/price.entity";
import { MoralisService } from "src/moralis/moralis.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Cron } from "@nestjs/schedule";

import { ConfigService } from "@nestjs/config";
import { EmailService } from "../email/email.service";

@Injectable()
export class PricesService {
  constructor(
    private readonly moralisService: MoralisService,
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private configService: ConfigService,
    private mailerService: EmailService,
  ) {}

  /**
   * Fetches the current price of a token from the Moralis API.
   *
   * @param {string} chain - The blockchain to query (e.g., "Ethereum").
   * @param {string} address - The contract address of the token.
   * @returns {Promise<any>} - The price details of the token.
   */
  async getTokenPrice(address: string) {
    try {
      const response = await this.moralisService.fetchTokenDetails(
        "0x1",
        address,
      );
      return response;
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw error;
    }
  }

  /**
   * Retrieves a list of saved token prices with optional filtering by blockchain.
   *
   * @param {string} [chain] - Optional blockchain filter select either (e.g., "Ethereum" or polygon ).
   * @param {number} [limit=10] - The number of results to return.
   * @param {number} [offset=0] - The starting position for pagination.
   * @returns {Promise<Price[]>} - A list of saved prices.
   */
  async getPrices(
    chain?: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Price[]> {
    const queryBuilder = this.priceRepository.createQueryBuilder("price");

    if (chain) {
      queryBuilder.where("LOWER(price.chain) = LOWER(:chain)", { chain });
    }

    return queryBuilder
      .orderBy("price.createdAt", "DESC")
      .take(limit)
      .skip(offset)
      .getMany();
  }

  /**
   *
   * API - RETURNING THE PRICES OF EACH HOUR (WITHIN 24 HOURS)
   * @param {string} address - The contract address of the token.
   * @returns {Promise<{hour: string; block: number; price: number}[]>} - A list of prices for the past 24 hours.
   *
   */
  async getPricesForLast24Hours(
    address: string,
  ): Promise<{ hour: string; block: number; price: number }[]> {
    const blockData = [];
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const currentHour = now.getHours();

    for (let i = 0; i <= currentHour; i++) {
      const sharpHour = new Date(
        now.getTime() - i * 60 * 60 * 1000,
      ).toISOString();

      const response = await this.moralisService.getBlockNumberFromDate(
        "0x1",
        sharpHour,
      );
      const price = await this.moralisService.fetchTokenDetails(
        "0x1",
        address,
        response.block,
      );

      blockData.push({
        hour: sharpHour.replace("T", " "),
        block: response.block,
        price: price.usdPrice,
        trx_date: response.date.replace("T", " "),
      });
    }

    return blockData;
  }

  /**
   * AUTOMATICALLY SAVE THE PRICE OF ETHEREUM AND POLYGON EVERY 5 MINUTES
   * I MAKE 1 MINUTE FOR TESTING PURPOSE
   */
  @Cron("0 */5 * * * *")
  async handleCron() {
    const ethAddress = this.configService.get<string>("ETH_CONTRACT_ADDRESS");
    const polygonAddress = this.configService.get<string>(
      "POLYGON_CONTRACT_ADDRESS",
    );

    try {
      const [ethPriceDetails, polygonPriceDetails] = await Promise.all([
        this.moralisService.fetchTokenDetails("0x1", ethAddress),
        this.moralisService.fetchTokenDetails("0x1", polygonAddress),
      ]);

      const ethPrice = this.createPriceEntry("Ethereum", ethPriceDetails);
      const polygonPrice = this.createPriceEntry(
        "Polygon",
        polygonPriceDetails,
      );

      await Promise.all([
        this.priceRepository.save(ethPrice),
        this.priceRepository.save(polygonPrice),
      ]);

      console.log(
        "--------------------Prices saved for Ethereum and Polygon --------------------",
      );
    } catch (error) {
      console.error("Error fetching or saving prices:", error);
    }
  }

  private createPriceEntry(chain: string, priceDetails: any): Price {
    const price = new Price();
    price.chain = chain;
    price.exchangeName = priceDetails.exchangeName;
    price.usdPrice = priceDetails.usdPrice;
    price.dailyPercentageChange = parseFloat(priceDetails["24hrPercentChange"]);
    price.tokenSymbol = priceDetails.tokenSymbol;
    price.tokenName = priceDetails.tokenName;
    price.contractAddress = priceDetails.tokenAddress;

    return price;
  }
}
