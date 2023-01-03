import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
// import { LoggerModule } from 'nestjs-pino';
import { LoggerModule } from 'nestjs-rollbar';
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
    // LoggerModule.forRoot(),
    LoggerModule.forRoot({
			// accessToken: process.env.TOKEN_ROLLBAR,
      accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
			environment: process.env.APP_ENVIRONMENT,
      captureUncaught: true,
      captureUnhandledRejections: true,
      endpoint: "https://api.rollbar.com/api/1/item"
		}),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port:  parseInt(process.env.REDIS_PORT)
      }
    }),
    BullModule.registerQueue({
      name: 'recommendation-queue'
    }),
    CacheModule.register({ 
      cache: redisStore, 
      isGlobal: true,
      host: process.env.REDIS_HOST,
      ttl: 86400000, // expire redis cache 1 day
      port:  parseInt(process.env.REDIS_PORT)
    })
  ],
  controllers: [AppController, RecommendationController, RecommendationControllerV2],
  providers: [AppService, RecommendationService, RecommendationServiceV2, RecommendationProcessor],
})
export class AppModule { }
