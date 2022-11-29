import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateRecommendationDto, CreateRecommendationV2Dto } from "src/dto/create-recommendation.dto";
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

  async createRecommendationV2(
    createRecommendationV2Dto: CreateRecommendationV2Dto
  ): Promise<IRecommendation> {
    let newRecommendation;
    const cuisineId = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.cuisineId : 0;
    const restaurantId = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.restaurantId : 0;
    const clevertapId = createRecommendationV2Dto.profiles[0] ? createRecommendationV2Dto.profiles[0].objectId : null;
    const userId = createRecommendationV2Dto.profiles[0] ? createRecommendationV2Dto.profiles[0].key_values.clevertapId : 0;
    
    newRecommendation = await this.recommendationModel.create({
        cuisineId: cuisineId,
        restaurantId: restaurantId,
        clevertapId: clevertapId,
        userId: userId,
        createdDate: now(),
        updatedDate: now(),
      });
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
      size = 20;
    }
    result = existingRecommendation.slice((page - 1) * size, page * size);
    if (!result) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return result;
  }
}
