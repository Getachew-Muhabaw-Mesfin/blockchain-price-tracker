import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsEmail,
} from "class-validator";

export enum Frequency {
  ONCE = "Once",
  FIVE_MINUTES = "5 Minutes",
  FIFTEEN_MINUTES = "15 Minutes",
  THIRTY_MINUTES = "30 Minutes",
  ONE_HOUR = "1 Hour",
  ONE_DAY = "1 Day",
}

export enum NotificationType {
  EMAIL = "email",
  WHATSAPP = "whatsapp",
  SMS = "sms",
  TELEGRAM = "telegram",
}

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  alertName: string;

  @IsString()
  @IsNotEmpty()
  chain: string;

  @IsNumber()
  @IsNotEmpty()
  targetValue: number;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Frequency, {
    message:
      "Frequency must be one of: Once, 5 Minutes, 15 Minutes, 30 Minutes, 1 Hour, 1 Day",
  })
  @IsNotEmpty()
  frequency: Frequency;

  @IsEnum(NotificationType, {
    message: "Notification type must be one of: email, whatsapp, sms, telegram",
  })
  @IsNotEmpty()
  notificationMethod: NotificationType;
}
