import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecommendationDto {
  @ApiProperty({
    example: 'b4429904b-3752-44ef-b37d-a152aa99c495',
  })
  clevertapId: string;

  @ApiPropertyOptional({
    example: [234,557,889],
  })
  restaurantIds: any;

  @ApiPropertyOptional({
    example: [100,200,300],
  })
  
  cuisineIds: any;

  @ApiProperty({})
  createDate: Date;

  @ApiProperty({})
  updatedDate: Date;
}
