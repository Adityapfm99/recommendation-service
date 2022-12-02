import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateRecommendationV2Dto } from 'src/dto/create-recommendation.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationRecommendationDto } from '../../dto/pagination-recommendation.dto';
import { RecommendationServiceV2 } from '../../service/recommendation/recommendation.serviceV2';
import { request } from 'express';


@ApiTags('Recommendation v2')
@Controller('api/v2/recommendation')
export class RecommendationControllerV2 {
  constructor(private readonly recommendationServiceV2: RecommendationServiceV2) {}

  @Post()
  async insertRecommendation(
    @Res() response,
    @Body() createRecommendationDto: CreateRecommendationV2Dto,
  ) {
    try {
      const Recommendation =
        await this.recommendationServiceV2.createRecommendationV2(
          createRecommendationDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: 'success',
        statusCode: 201,
        Recommendation,
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
    @Req() request,
    @Param('clevertapId') clevertapId: string,
    @Query() { page, size }: PaginationRecommendationDto,
  ) {
    const locale = request.headers['x-hh-language'];
    try {
      const data = await this.recommendationServiceV2.getClevertapId(clevertapId, page, size,locale);
      if (data.length) {
        return response.status(HttpStatus.OK).json({
          data,
          success : true,
          
        });
      } else {
        return response.status(HttpStatus.NOT_FOUND).json({
          data,
          success : false,
        
        });
      }
      
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
