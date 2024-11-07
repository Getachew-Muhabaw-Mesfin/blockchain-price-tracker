import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  healthcheck() {
    return {
      status: 200,
      message: "The server is up and running! 🚀",
    };
  }
}
