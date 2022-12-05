import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  CACHE_MANAGER,
  Res,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { PaginationRecommendationDto } from '../../dto/pagination-recommendation.dto';
import { RecommendationServiceV2 } from '../../service/recommendation/recommendation.serviceV2';


@ApiTags('Recommendation v2')
@Controller('api/v2/recommendation')
export class RecommendationControllerV2 {
  constructor(private readonly recommendationServiceV2: RecommendationServiceV2,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('/:clevertapId')
  async getClevertap(
    @Res() response,
    @Req() request,
    @Param('clevertapId') clevertapId: string,
    @Query() { page, size }: PaginationRecommendationDto,
  ) {
    const locale = request.headers['x-hh-language'];
    let data;
    try {
       data = await this.cacheManager.get<{ clevertapId: string }>(
        clevertapId,
      );

      if (data) {
        console.log(`Getting data from cache!`);
        return response.status(HttpStatus.OK).json({
          data,
          success : true,
        });
      }
      data = await this.recommendationServiceV2.getClevertapId(clevertapId, page, size,locale);
      await this.cacheManager.set(clevertapId, data);
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
