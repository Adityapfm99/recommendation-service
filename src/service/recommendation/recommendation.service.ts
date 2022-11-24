import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRecommendationDto } from 'src/dto/create-recommendation.dto';
import { IRecommendation } from 'src/interface/recommendation.interface';
import { Model, now } from 'mongoose';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Recommendation')
    private recommendationModel: Model<IRecommendation>,
  ) {}

  async createRecommendation(
    createRecommendationDto: CreateRecommendationDto,
  ): Promise<IRecommendation> {  
    let newRecommendation;
    if (createRecommendationDto.cuisineId != '0' && createRecommendationDto.restaurantId != '0' && createRecommendationDto.clevertapId != '0') {
       newRecommendation = await this.recommendationModel.create(
        { cuisineId: createRecommendationDto.cuisineId,
          restaurantId: createRecommendationDto.restaurantId,
          clevertapId: createRecommendationDto.clevertapId,
          createdDate: now(),
          updatedDate: now()
         },
      );
    }
    
  return newRecommendation;
  }

  async getClevertapId(clevertapId: string): Promise<any> {
    const existingRecommendation = await this.recommendationModel
      .find({ clevertapId: clevertapId })
      .sort({ createdDate: -1}) // order desc
      .limit(20)
      .exec();
    if (!existingRecommendation) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return existingRecommendation;
  }
}
