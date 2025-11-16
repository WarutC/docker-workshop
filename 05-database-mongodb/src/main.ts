import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`\n🚀 Server is running on port ${port}`);
  console.log(`📦 Container ID: ${require('os').hostname()}`);
  console.log(`🟢 Node Version: ${process.version}`);
  console.log(`\n🔗 API Endpoints:`);
  console.log(`   - http://localhost:${port}/`);
  console.log(`   - http://localhost:${port}/health`);
  console.log(`   - http://localhost:${port}/users`);
  console.log(`   - http://localhost:${port}/stats\n`);
}

bootstrap();
