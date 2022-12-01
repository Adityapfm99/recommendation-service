import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
require('dotenv').config()
import { RecommendationController } from './controller/recommendation/recommendation.controller';
import { RecommendationSchema } from './schema/recommendation.schema';
import { RecommendationService } from './service/recommendation/recommendation.service';
import { RecommendationControllerV2 } from './controller/recommendation/recommendation.controllerV2';
import { RecommendationServiceV2 } from './service/recommendation/recommendation.serviceV2';

@Module({
  imports: [MongooseModule.forRoot(`${process.env.MONGO_DB_URI}`,{dbName: 'recommendations'}),
  MongooseModule.forFeature([{ name: 'Recommendation', schema: RecommendationSchema }]),
  LoggerModule.forRoot()],
  controllers: [AppController, RecommendationController, RecommendationControllerV2],
  providers: [AppService,RecommendationService,RecommendationServiceV2],
})
export class AppModule {}
