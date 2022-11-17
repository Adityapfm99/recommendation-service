import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecommendationDto {
  @ApiProperty({
    example: 'b4429904b-3752-44ef-b37d-a152aa99c495',
  })
  clevertapId: string;

  @ApiProperty({})
  cuisineIds: any;

  @ApiProperty({})
  createDate: Date;

  @ApiProperty({})
  updatedDate: Date;
}
