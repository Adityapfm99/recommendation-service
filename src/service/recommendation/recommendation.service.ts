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

  async upsert(
    createRecommendationDto: CreateRecommendationDto,
  ): Promise<IRecommendation> {
    const filter = { clevertapId: createRecommendationDto.clevertapId };
    const update = {
      cuisineIds: createRecommendationDto.cuisineIds,
      updatedDate: now(),
    };

    let newRecommendation = await this.recommendationModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
        upsert: true,
      },
    );
    return newRecommendation;
  }

  async getClevertapId(clevertapId: string): Promise<any> {
    const existingRecommendation = await this.recommendationModel
      .findOne({ clevertapId: clevertapId })
      .exec();
    if (!existingRecommendation) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return existingRecommendation;
  }
}
