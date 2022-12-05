import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IRecommendation } from "src/interface/recommendation.interface";
import { Model, now } from "mongoose";
import axios from "axios";

@Injectable()
export class RecommendationServiceV2 {
  constructor(
    @InjectModel("Recommendation")
    private recommendationModel: Model<IRecommendation>
  ) {}

  async getClevertapId(
    clevertapId: string,
    page: number,
    size: number,
    locale: string
  ): Promise<any> {
    let result;
    let existingRecommendation = await this.recommendationModel
      .find({ clevertap_id: clevertapId })
      .sort({ created_date: -1 }) // order desc
      .exec();
    if (!page || !size) {
      page = 1;
      size = 10;
    }
    let data = [];
    let resp;
    result = existingRecommendation.slice((page - 1) * size, page * size);
    if (!locale) {
      locale = 'en';
    }
    const header = {
      "Content-Type": "application/json",
      "X-HH-Language": locale,
    };
    if (result.length) {
      for (const item of result) {
        data.push(Number(item.cuisine_id));
      }
    }
    let unique = [...new Set(data)];

    const cuisineUrl = `https://hhstaging.hungryhub.com/api/v5/restaurants/recommendation.json?page%5Bsize%5D=${size}&page%5Bnumber%5D=${page}&cuisine_id_eq=${unique}`;
    const response = await axios.get(cuisineUrl, {
      headers: header,
    });
    if (response.status === 200) {
      resp = response.data.data;
    }
    if (!result) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return resp;
  }
}