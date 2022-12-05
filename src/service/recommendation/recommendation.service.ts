import { Injectable } from "@nestjs/common";
import { CreateRecommendationV2Dto } from "src/dto/create-recommendation.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class RecommendationService {
  constructor(
    @InjectQueue("recommendation-queue")
    private recommendationQueue: Queue
  ) {}

  async jobQueue(createRecommendationV2Dto: CreateRecommendationV2Dto) {
    const jobOptions = {
      removeOnComplete: false,
      removeOnFail: false,
      delay: 2000, // delay 2 seconds
    };

    await this.recommendationQueue.add(
      "recommendation",
      createRecommendationV2Dto,
      jobOptions
    );
    this.recommendationQueue.clean(300000, "completed", 100); // expire 5 minutes when completed
    this.recommendationQueue.on("cleaned", function (jobs, type) {
      console.log("Cleaned %s %s jobs", jobs.length, type);
    });
  }
}
