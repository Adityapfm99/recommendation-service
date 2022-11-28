import {ApiPropertyOptional} from '@nestjs/swagger';

export class PaginationRecommendationDto {

@ApiPropertyOptional()
page: number;

@ApiPropertyOptional()
size: number;

@ApiPropertyOptional()
sortBy: string;

@ApiPropertyOptional({ enum: ['asc', 'desc'] })
sortDir: 'asc' | 'desc';
}