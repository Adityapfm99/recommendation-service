
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import { Queue } from "bull";
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter, setQueues } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Recommendation Restaurants')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/bull-board');

  const aQueue = app.get<Queue>(
    `BullQueue_recommendation-queue`
  )

  createBullBoard({
    queues: [
      new BullAdapter(aQueue),
    ],
    serverAdapter,
  })
  aQueue.on('completed', job => {
     
    this.aQueue.clean(10);

  });
  // Create bull board for monitor your queue process, must be called after setQueues calls
  app.use('/bull-board', serverAdapter.getRouter());

  const port = (process.env.PORT || 3000);
  await app.listen(port, () => {
    console.log(`===== Server listening on port ${port} =====`)
  });

}
bootstrap();

