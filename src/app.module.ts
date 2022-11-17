import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationController } from './controller/recommendation/recommendation.controller';
import { RecommendationSchema } from './schema/recommendation.schema';
import { RecommendationService } from './service/recommendation/recommendation.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017',{dbName: 'recommendation'}),
  MongooseModule.forFeature([{ name: 'Recommendation', schema: RecommendationSchema }])],
  controllers: [AppController,RecommendationController],
  providers: [AppService,RecommendationService],
})
export class AppModule {}
