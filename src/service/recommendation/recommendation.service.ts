import {
  Injectable,
} from "@nestjs/common";
import { CreateRecommendationV2Dto } from "src/dto/create-recommendation.dto";
import { InjectQueue, OnQueueCleaned, OnQueueCompleted } from "@nestjs/bull";
import { Queue } from "bull";
import { delay } from "rxjs";


@Injectable()
export class RecommendationService {
  constructor(
    @InjectQueue('recommendation-queue')
    private recommendationQueue: Queue
  ) {}

  async jobQueue(
    createRecommendationV2Dto: CreateRecommendationV2Dto
  ) {
    const jobOptions = {
      removeOnComplete: false,
      removeOnFail: false,
      delay: 5000,
      
      
  }
  
    const job = await this.recommendationQueue.add('recommendation', createRecommendationV2Dto, jobOptions);


 
  }

  

}
