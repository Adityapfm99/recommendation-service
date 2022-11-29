import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecommendationDto {
  @ApiProperty({
    example: 'b4429904b-3752-44ef-b37d-a152aa99c495',
  })
  clevertapId: string;

  @ApiPropertyOptional({
    example: [234,557,889],
  })
  restaurantId: string;

  @ApiPropertyOptional({
    example: [100,200,300],
  })
  
  cuisineId: string;

  @ApiProperty({})
  createDate: Date;

  @ApiProperty({})
  updatedDate: Date;
}
export class keyValuesVm {
  @ApiProperty({})
  clevertapId: string;

  @ApiProperty({})
  cuisineId: string;

  @ApiProperty({})
  restaurantId: string;
}

export class objectIdVm {
  @ApiProperty({})
  objectId: string;

}
export class clevertapIdVm {
  @ApiProperty({})
  clevertapId: string;
}

export class profilesVm {
  @ApiProperty({type: () => clevertapIdVm})
  key_values: clevertapIdVm;

  @ApiProperty({type: () => objectIdVm})
  objectId: objectIdVm;
}

export class CreateRecommendationV2Dto {

  @ApiProperty({ type: () => keyValuesVm })
  key_values: keyValuesVm;

  @ApiProperty({ type: () => [profilesVm] })
  profiles: profilesVm;

}

