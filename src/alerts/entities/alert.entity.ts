import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

/**
 * ALERT ENTITY
 */
@Entity("alerts")
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alertName: string;

  @Column()
  chain: string;

  @Column("decimal", { precision: 18, scale: 8 })
  targetValue: number;

  @Column()
  frequency: string;

  @Column()
  notificationMethod: string;
  @Column()
  email: string;

  @Column({ default: false })
  isNotify: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}
