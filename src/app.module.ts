import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from 'nestjs-pino';
require('dotenv').config()
import { RecommendationController } from './controller/recommendation/recommendation.controller';
import { RecommendationSchema } from './schema/recommendation.schema';
import { RecommendationService } from './service/recommendation/recommendation.service';
import { RecommendationControllerV2 } from './controller/recommendation/recommendation.controllerV2';
import { BullModule } from '@nestjs/bull'
import { RecommendationServiceV2 } from './service/recommendation/recommendation.serviceV2';
import { RecommendationProcessor } from './processor/recommendation.processor';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_DB_URI}`, { dbName: 'recommendations' }),
    MongooseModule.forFeature([{ name: 'Recommendation', schema: RecommendationSchema }]),
    LoggerModule.forRoot(),
    BullModule.forRoot({
      redis: {
        // host: process.env.REDIS_HOST,
        host:'dev-app-lru-redis.fhgftt.ng.0001.apse1.cache.amazonaws.com',
        // port:  parseInt(process.env.REDIS_PORT)
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'recommendation-queue'
    }),
    CacheModule.register({ 
      cache: redisStore, 
      isGlobal: true,
      // host: process.env.REDIS_HOST,
      host:'dev-app-lru-redis.fhgftt.ng.0001.apse1.cache.amazonaws.com',
      ttl: 300000, // expire 5 minutes
      // port:  parseInt(process.env.REDIS_PORT)
      port: 6379
    })
  ],
  controllers: [AppController, RecommendationController, RecommendationControllerV2],
  providers: [AppService, RecommendationService, RecommendationServiceV2, RecommendationProcessor],
})
export class AppModule { }
