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

  // async upsert(
  //   createRecommendationDto: CreateRecommendationDto,
  // ): Promise<IRecommendation> {
  //   let update;
  //   const filter = { clevertapId: createRecommendationDto.clevertapId };
  //   if (createRecommendationDto.cuisineIds) {
  //     update = {
  //       restaurantIds: createRecommendationDto.restaurantIds,
  //       updatedDate: now(),
  //       cuisineIds : createRecommendationDto.cuisineIds
  //     };
  //   } else {
  //     update = {
  //       restaurantIds: createRecommendationDto.restaurantIds,
  //       updatedDate: now(),
  //     };
  //   }
  
  //   let newRecommendation = await this.recommendationModel.findOneAndUpdate(
  //     filter,
  //     update,
  //     {
  //       new: true,
  //       upsert: true,
  //     },
  //   );
  //   return newRecommendation;
  // }
  async createRecommendation(
    createRecommendationDto: CreateRecommendationDto,
  ): Promise<IRecommendation> {  
    const newRecommendation = await this.recommendationModel.create(
      { cuisineId: createRecommendationDto.cuisineId,
        restaurantId: createRecommendationDto.restaurantId,
        clevertapId: createRecommendationDto.clevertapId,
        createdDate: now(),
        updatedDate: now()
       },
    );
    
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
