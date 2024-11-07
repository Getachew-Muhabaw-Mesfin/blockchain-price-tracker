import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

/**
 * PRICE ENTITY
 */
@Entity("prices")
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column()
  exchangeName: string;

  @Column("decimal", { precision: 18, scale: 8 })
  usdPrice: number;

  @Column("decimal", { precision: 5, scale: 2 })
  dailyPercentageChange: number;

  @Column()
  tokenSymbol: string;

  @Column()
  tokenName: string;

  @Column()
  contractAddress: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}
