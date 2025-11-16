import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  getInfo() {
    const db = this.databaseService.getDb();
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/workshop?authSource=admin';

    return {
      message: 'สวัสดี จาก NestJS API + MongoDB!',
      status: 'running',
      containerInfo: {
        hostname: require('os').hostname(),
        nodeVersion: process.version,
      },
      database: {
        connected: !!db,
        uri: mongoUri.replace(/\/\/.*@/, '//***:***@'),
      },
      endpoints: {
        health: '/health',
        users: '/users',
        stats: '/stats',
      },
    };
  }

  @Get('health')
  async getHealth() {
    try {
      const db = this.databaseService.getDb();

      if (!db) {
        return {
          status: 'unhealthy',
          message: 'Database not connected',
        };
      }

      // Ping database
      await db.admin().ping();

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const db = this.databaseService.getDb();
      const stats = await db.stats();
      const userCount = await db.collection('users').countDocuments();

      return {
        database: stats.db,
        collections: stats.collections,
        dataSize: `${(stats.dataSize / 1024).toFixed(2)} KB`,
        storageSize: `${(stats.storageSize / 1024).toFixed(2)} KB`,
        users: {
          total: userCount,
        },
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}
