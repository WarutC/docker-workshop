import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return {
      message: 'สวัสดี จาก NestJS API!',
      status: 'running',
      containerInfo: {
        hostname: require('os').hostname(),
        nodeVersion: process.version,
        platform: process.platform,
      },
      endpoints: {
        health: '/health',
        info: '/info',
        users: '/users',
      },
    };
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('info')
  getInfo() {
    return this.appService.getInfo();
  }

  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }
}
