const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/workshop?authSource=admin';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Client
let db;
let client;

// เชื่อมต่อ MongoDB
async function connectToMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

    client = new MongoClient(MONGODB_URI);
    await client.connect();

    db = client.db('workshop');
    console.log('✅ Connected to MongoDB successfully!');

    // สร้าง collection ถ้ายังไม่มี
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('📦 Created "users" collection');

      // เพิ่มข้อมูลตัวอย่าง
      await db.collection('users').insertMany([
        { name: 'สมชาย ใจดี', email: 'somchai@example.com', role: 'admin', createdAt: new Date() },
        { name: 'สมหญิง รักสะอาด', email: 'somying@example.com', role: 'user', createdAt: new Date() },
        { name: 'สมศักดิ์ มีสุข', email: 'somsak@example.com', role: 'user', createdAt: new Date() },
      ]);
      console.log('✨ Inserted sample data');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'สวัสดี จาก API + MongoDB!',
    status: 'running',
    containerInfo: {
      hostname: require('os').hostname(),
      nodeVersion: process.version,
    },
    database: {
      connected: !!db,
      uri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'),
    },
    endpoints: {
      health: '/health',
      users: '/users',
      stats: '/stats',
    },
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ status: 'unhealthy', message: 'Database not connected' });
    }

    // Ping database
    await db.admin().ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    res.json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await db.collection('users').insertOne({
      name,
      email,
      role: role || 'user',
      createdAt: new Date(),
    });

    const newUser = await db.collection('users').findOne({ _id: result.insertedId });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database stats
app.get('/stats', async (req, res) => {
  try {
    const stats = await db.stats();
    const userCount = await db.collection('users').countDocuments();

    res.json({
      database: stats.db,
      collections: stats.collections,
      dataSize: `${(stats.dataSize / 1024).toFixed(2)} KB`,
      storageSize: `${(stats.storageSize / 1024).toFixed(2)} KB`,
      users: {
        total: userCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  await connectToMongoDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📦 Container ID: ${require('os').hostname()}`);
    console.log(`🟢 Node Version: ${process.version}`);
    console.log(`\n🔗 API Endpoints:`);
    console.log(`   - http://localhost:${PORT}/`);
    console.log(`   - http://localhost:${PORT}/health`);
    console.log(`   - http://localhost:${PORT}/users`);
    console.log(`   - http://localhost:${PORT}/stats\n`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, closing MongoDB connection...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

startServer();
