import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateRecommendationDto } from "src/dto/create-recommendation.dto";
import { IRecommendation } from "src/interface/recommendation.interface";
import { Model, now } from "mongoose";

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel("Recommendation")
    private recommendationModel: Model<IRecommendation>
  ) {}

  async createRecommendation(
    createRecommendationDto: CreateRecommendationDto
  ): Promise<IRecommendation> {
    let newRecommendation;
    if (
      createRecommendationDto.cuisineId != "0" &&
      createRecommendationDto.restaurantId != "0" &&
      createRecommendationDto.clevertapId != "0"
    ) {
      newRecommendation = await this.recommendationModel.create({
        cuisineId: createRecommendationDto.cuisineId,
        restaurantId: createRecommendationDto.restaurantId,
        clevertapId: createRecommendationDto.clevertapId,
        createdDate: now(),
        updatedDate: now(),
      });
    } else {
      throw new BadRequestException(`Payload not completed`);
    }

    return newRecommendation;
  }

  async getClevertapId(
    clevertapId: string,
    page: number,
    size: number
  ): Promise<any> {
    let result;
    let existingRecommendation = await this.recommendationModel
      .find({ clevertapId: clevertapId })
      .sort({ createdDate: -1 }) // order desc
      .exec();
    if (!page || !size) {
      page = 1;
      size = 2;
    }
    result = existingRecommendation.slice((page - 1) * size, page * size);
    if (!result) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return result;
  }
}
