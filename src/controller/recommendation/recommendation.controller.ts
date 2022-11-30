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
import { RecommendationService } from 'src/service/recommendation/recommendation.service';
import { PaginationRecommendationDto } from '../../dto/pagination-recommendation.dto';


@ApiTags('Recommendation v1')
@Controller('api/v1/recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async insertRecommendation(
    @Res() response,
    @Body() createRecommendationDto: CreateRecommendationV2Dto,
  ) {
    try {
      const Recommendation =
        await this.recommendationService.createRecommendationV2(
          createRecommendationDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: 'success',
        statusCode: 201,
        succcess: true,
        Recommendation,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Recommendation not created!',
        succcess: false,
        error: 'Bad Request',
      });
    }
  }

  @Get('/:clevertapId')
  async getClevertap(
    @Res() response,
    @Param('clevertapId') clevertapId: string,
    @Query() { page, size }: PaginationRecommendationDto,
  ) {
    try {
      const data = await this.recommendationService.getClevertapId(clevertapId, page, size);
      if (data.length) {
        return response.status(HttpStatus.OK).json({
          message: 'ok',
          succcess: true,
          statusCode: 200,
          data,
        });
      } else {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Recommendation Not Found',
          statusCode: 404,
          succcess: false,
          data,
        });
      }
      
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
