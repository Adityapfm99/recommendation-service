import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateRecommendationV2Dto } from 'src/dto/create-recommendation.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationRecommendationDto } from '../../dto/pagination-recommendation.dto';
import { RecommendationService } from '../../service/recommendation/recommendation.service';

@ApiTags('Recommendation v1')
@Controller('api/v1/recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async jobQueue(
    @Res() response,
    @Body() createRecommendationDto: CreateRecommendationV2Dto,
  ) {
    try {
      const Recommendation =
        await this.recommendationService.jobQueue(
          createRecommendationDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: 'success',
        statusCode: 201,
        success: true,
        Recommendation,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Recommendation not created!',
        success: false,
        error: 'Bad Request',
      });
    }
  }

}
