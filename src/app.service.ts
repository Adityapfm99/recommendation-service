import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AppService {
  healthyCheck(): string {
    const data = {
      uptime: process.uptime(),
      state: 'Ok',
      message: 'Server is Running...',
    }
    return JSON.stringify(data);
      
  } catch (e) {
      console.error(`error check health:  msg: ${e}`);
      throw new InternalServerErrorException(e);
  }
}
