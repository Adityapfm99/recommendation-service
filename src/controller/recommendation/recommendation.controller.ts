import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateRecommendationDto } from 'src/dto/create-recommendation.dto';
import { ApiTags } from '@nestjs/swagger';
import { RecommendationService } from 'src/service/recommendation/recommendation.service';

@ApiTags('Recommendation v1')
@Controller('api/v1/recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async insertRecommendation(
    @Res() response,
    @Body() createRecommendationDto: CreateRecommendationDto,
  ) {
    try {
      const Recommendation =
        await this.recommendationService.upsert(
          createRecommendationDto,
        );
        const result = {
          clevertapId : Recommendation.clevertapId,
          restaurantIds: Recommendation.restaurantIds,
          cuisineIds: Recommendation.cuisineIds || [],
        }
      return response.status(HttpStatus.CREATED).json({
        message: 'success',
        statusCode: 201,
        result,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Recommendation not created!',
        error: 'Bad Request',
      });
    }
  }

  @Get('/:clevertapId')
  async getClevertap(
    @Res() response,
    @Param('clevertapId') clevertapId: string,
  ) {
    try {
      const recommendation = await this.recommendationService.getClevertapId(clevertapId);
      const result = {
        clevertapId : recommendation.clevertapId,
        restaurantIds: recommendation.restaurantIds,
      }
      return response.status(HttpStatus.OK).json({
        message: 'success',
        statusCode: 200,
        result,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
