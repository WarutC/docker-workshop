import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/workshop?authSource=admin';

      console.log('🔄 Connecting to MongoDB...');
      console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();

      this.db = this.client.db('workshop');
      console.log('✅ Connected to MongoDB successfully!');

      // สร้าง collection ถ้ายังไม่มี
      await this.initializeCollections();
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  private async initializeCollections() {
    const collections = await this.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('users')) {
      await this.db.createCollection('users');
      console.log('📦 Created "users" collection');

      // เพิ่มข้อมูลตัวอย่าง
      await this.db.collection('users').insertMany([
        { name: 'สมชาย ใจดี', email: 'somchai@example.com', role: 'admin', createdAt: new Date() },
        { name: 'สมหญิง รักสะอาด', email: 'somying@example.com', role: 'user', createdAt: new Date() },
        { name: 'สมศักดิ์ มีสุข', email: 'somsak@example.com', role: 'user', createdAt: new Date() },
      ]);
      console.log('✨ Inserted sample data');
    }
  }

  private async disconnect() {
    console.log('👋 Closing MongoDB connection...');
    if (this.client) {
      await this.client.close();
    }
  }

  getDb(): Db {
    return this.db;
  }

  getClient(): MongoClient {
    return this.client;
  }
}
