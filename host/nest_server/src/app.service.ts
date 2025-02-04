import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  async pingDatabase(): Promise<string> {
    try {
      if (true) {
        return "OK";
      } else {
        return "BAD";
      }
    } catch (error) {
      console.error('Error pinging database:', error);
      return "BAD";
    }
  }

  async getHello(): Promise<object> {
    const statusDB = await this.pingDatabase();
    return {
      status: 200,
      message: 'OK',
      db: statusDB
    };
  }
}
