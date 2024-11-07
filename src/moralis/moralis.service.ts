import { Injectable, OnModuleInit } from "@nestjs/common";
import Moralis from "moralis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MoralisService implements OnModuleInit {
  private static isStarted = false;

  constructor(private configService: ConfigService) {}

  /**
   * INITIALIZING MORALIS BLOCKCHAIN API
   */
  async onModuleInit() {
    if (!MoralisService.isStarted) {
      const MORALIS_API_KEY = this.configService.get<string>("MORALIS_API_KEY");
      await Moralis.start({
        apiKey: MORALIS_API_KEY,
      });

      MoralisService.isStarted = true;
      console.log("Moralis SDK initialized successfully");
    }
  }

  /**
   * FETCH TOKEN PRICE AND DETAILS
   */
  async fetchTokenDetails(chain: string, address: string, block?: number) {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain,
        address,
        include: "percent_change",
        toBlock: block,
      });

      return response.raw;
    } catch (error) {
      console.error("Error fetching token details:", error);
      throw error;
    }
  }

  /**
   * FETCH BLOCK NUMBER FROM DATE
   */
  async getBlockNumberFromDate(chain: string, date: string) {
    const response = await Moralis.EvmApi.block.getDateToBlock({
      chain,
      date,
    });
    return response.raw;
  }
}
