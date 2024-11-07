import { Controller, Get, Query } from "@nestjs/common";
import { PricesService } from "./prices.service";
import { Price } from "./entities/price.entity";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

@ApiTags("Prices")
@Controller("prices")
export class PricesController {
  constructor(private pricesService: PricesService) {}

  /**
   * FETCH TOKEN PRICE
   *
   * Fetches the price of a specific token using chain and address.
   */
  @Get("token")
  @ApiOperation({ summary: "Fetch the price of a specific token" })
  @ApiQuery({
    name: "address",
    required: true,
    description: "Token address on the ethereum blockchain",
  })
  @ApiResponse({
    status: 200,
    description: "Token price fetched successfully.",
  })
  async getTokenPrice(@Query("address") address: string) {
    return this.pricesService.getTokenPrice(address);
  }

  /**
   * FETCH PRICES
   *
   * Fetches the price of tokens at 5-minute intervals.
   */
  @Get("5-minutely-prices")
  @ApiOperation({
    summary: "Fetched Automatically Saved Prices every 5 minute (CRONE JOB) ",
  })
  @ApiQuery({
    name: "chain",
    required: false,
    description:
      "Optional: You can filter by blockchain of the two either  'Ethereum' or 'Polygon'",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limit the number of returned records",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Offset for pagination",
    example: 0,
  })
  @ApiResponse({ status: 200, description: "Prices fetched successfully." })
  async getFiveMinutelyPrice(
    @Query("chain") chain?: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<Price[]> {
    return this.pricesService.getPrices(chain, limit, offset);
  }

  /**
   * FETCH 24-HOURLY PRICE
   *
   * Fetches prices of a specific token for the last 24 hours.
   */
  @Get("24-hourly-price")
  @ApiOperation({
    summary: "Fetch token prices for the Start of daily with 1 Hour interval",
  })
  @ApiQuery({
    name: "address",
    required: true,
    description: "Token address on the blockchain",
  })
  @ApiResponse({
    status: 200,
    description: "24-hourly prices fetched successfully.",
  })
  async getBlock(@Query("address") address: string) {
    return this.pricesService.getPricesForLast24Hours(address);
  }
}
