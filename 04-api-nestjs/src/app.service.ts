import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  getInfo() {
    return {
      application: 'NestJS API Workshop',
      version: '1.0.0',
      description: 'API example for Docker/Podman training',
      environment: process.env.NODE_ENV || 'development',
      containerInfo: {
        hostname: require('os').hostname(),
        platform: process.platform,
        nodeVersion: process.version,
        cpus: require('os').cpus().length,
        totalMemory: `${(require('os').totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        freeMemory: `${(require('os').freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      },
    };
  }

  getUsers() {
    // Mock data
    return {
      total: 3,
      users: [
        {
          id: 1,
          name: 'สมชาย ใจดี',
          email: 'somchai@example.com',
          role: 'admin',
        },
        {
          id: 2,
          name: 'สมหญิง รักสะอาด',
          email: 'somying@example.com',
          role: 'user',
        },
        {
          id: 3,
          name: 'สมศักดิ์ มีสุข',
          email: 'somsak@example.com',
          role: 'user',
        },
      ],
    };
  }
}
