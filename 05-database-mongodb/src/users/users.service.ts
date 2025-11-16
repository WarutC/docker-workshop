import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const db = this.databaseService.getDb();
    const users = await db.collection('users').find({}).toArray();
    return {
      total: users.length,
      users,
    };
  }

  async findOne(id: string) {
    const db = this.databaseService.getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    return user;
  }

  async create(createUserDto: { name: string; email: string; role?: string }) {
    const db = this.databaseService.getDb();
    const { name, email, role } = createUserDto;

    const result = await db.collection('users').insertOne({
      name,
      email,
      role: role || 'user',
      createdAt: new Date(),
    });

    const newUser = await db.collection('users').findOne({ _id: result.insertedId });
    return newUser;
  }

  async delete(id: string) {
    const db = this.databaseService.getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return { deletedCount: result.deletedCount };
  }
}
