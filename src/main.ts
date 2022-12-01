
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger/dist';
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Recommendation Restaurants')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);


const recommendationQueue = new Queue('recommendationQueue', {
  redis: { port: 6379, host: '127.0.0.1' },
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(recommendationQueue)],
  serverAdapter: serverAdapter,
});


app.use('/admin/queues', serverAdapter.getRouter());

  const port = (process.env.PORT || 3000);
  await app.listen(port, () => {
    console.log(`===== Server listening on port ${port} =====`)
  });

}
bootstrap();

