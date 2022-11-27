import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
require('dotenv').config()
import { RecommendationController } from './controller/recommendation/recommendation.controller';
import { RecommendationSchema } from './schema/recommendation.schema';
import { RecommendationService } from './service/recommendation/recommendation.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.3lpu8ut.mongodb.net/recommendations',{dbName: 'recommendations'}),
  MongooseModule.forFeature([{ name: 'Recommendation', schema: RecommendationSchema }]),
  LoggerModule.forRoot()],
  controllers: [AppController,RecommendationController],
  providers: [AppService,RecommendationService],
})
export class AppModule {}

// 'mongodb+srv://admin:admin@cluster0.3lpu8ut.mongodb.net/recommendations'
// imports: [MongooseModule.forRoot(`${process.env.MONGO_DB_URI}`,{dbName: 'recommendations'}),