import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateRecommendationDto, CreateRecommendationV2Dto } from "src/dto/create-recommendation.dto";
import { IRecommendation } from "src/interface/recommendation.interface";
import { Model, now } from "mongoose";
import axios from "axios";

@Injectable()
export class RecommendationServiceV2 {
  constructor(
    @InjectModel("Recommendation")
    private recommendationModel: Model<IRecommendation>
  ) {}

  async createRecommendation(
    createRecommendationDto: CreateRecommendationDto
  ): Promise<IRecommendation> {
    let newRecommendation;
    if (
      createRecommendationDto.cuisineId != "0" &&
      createRecommendationDto.restaurantId != "0" &&
      createRecommendationDto.clevertapId != "0"
    ) {
      newRecommendation = await this.recommendationModel.create({
        cuisineId: createRecommendationDto.cuisineId,
        restaurantId: createRecommendationDto.restaurantId,
        clevertapId: createRecommendationDto.clevertapId,
        createdDate: now(),
        updatedDate: now(),
      });
    } else {
      throw new BadRequestException(`Payload not completed`);
    }

    return newRecommendation;
  }

  async createRecommendationV2(
    createRecommendationV2Dto: CreateRecommendationV2Dto
  ): Promise<IRecommendation> {
    let newRecommendation;
    let priceAndPricingType;
    let res;
    let names;
    let location;
    const cuisineId = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.cuisineId : 0;
    const restaurantId = createRecommendationV2Dto.profiles[0] ? createRecommendationV2Dto.profiles[0].key_values.restaurantId: 0;
    const clevertapId = createRecommendationV2Dto.profiles[0] ? createRecommendationV2Dto.profiles[0].objectId : null;
    const userId = createRecommendationV2Dto.profiles[0] ? createRecommendationV2Dto.profiles[0].key_values.clevertapId : 0;

    let name = createRecommendationV2Dto.profiles[0] ? createRecommendationV2Dto.profiles[0].key_values.name : null;
    let reviewScore = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.reviewsScore : null;
    let reviewCount = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.reviewsCount : null;
    // let location = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.location : null;
    let imageCoverUrl = null;
    let acceptVoucher = false;
    let cuisine = createRecommendationV2Dto.key_values ? createRecommendationV2Dto.key_values.cuisine : null;

    // const url =`${process.env.HH_URI}${restaurantId}.json`
    const url = `https://hungryhub.com/api/v5/restaurants/${restaurantId}.json`;
    
    const response =  await axios.get(url);
    if (response.status === 200) {
      res = response.data;
      priceAndPricingType = res.data.attributes.price_and_pricing_type || null;
      acceptVoucher  = res.data.attributes.accept_voucher || null;
      names = res.data.attributes.names || null;
      location = res.data.attributes.primary_location || null;
    }
    if (!reviewCount) {
      reviewCount = res.data.attributes.reviews_count;
    }
    if (!name) {
      name = res.data.attributes.name;
    }
    if (!reviewScore) {
      reviewScore = res.data.attributes.reviews_score;
    }
    if (!names) {
      names = res.data.attributes.names;
    }
    if (!location) {
      location = res.data.attributes.primary_location;
    }
    if (!imageCoverUrl) {
      imageCoverUrl = res.data.attributes.image_cover_url;
    }
    if (!cuisine) {
      cuisine = res.data.attributes.primary_cuisine;
    }
    if (restaurantId && response.status === 200) {
      newRecommendation = await this.recommendationModel.create({
        cuisine_id: cuisineId,
        primary_cuisine: cuisine,
        restaurant_id: restaurantId,
        clevertap_id: clevertapId,
        user_id: userId,
        names: names,
        name: name,
        reviews_count: reviewCount,
        reviews_score: reviewScore,
        primary_location: location,
        created_date: now(),
        updated_date: now(),
        accept_voucher: acceptVoucher,
        price_and_pricing_type: priceAndPricingType,
        image_cover_url: imageCoverUrl,
      });
    }
    return newRecommendation;
  }

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
      size = 20;
    }
    let attributes;
    let data = []
    let multiName;
    result = existingRecommendation.slice((page - 1) * size, page * size);
    const header = {
        'Content-Type': 'application/json',
        'x-hh-languange': locale,
};
    if (result.length) {
      for (const item of result) {
        const url = `https://hhstaging.hungryhub.com/api/v5/restaurants/${item.restaurant_id}.json`;
          const response =  await axios.get(url, {
            headers: header,
        });

        if (response.status === 200) { 
           
            let resp = response.data;
            if (locale === 'en') {
                multiName = resp.data.attributes.names.en;
            } else {
                multiName = resp.data.attributes.names.th;
            }   
            attributes = {
                "id": item.restaurant_id,
                "type": resp.data.type,
                "attributes": {
                  "start_date": "2020-06-10",
                  "total_locations": resp.data.attributes.locations.length,
                  "total_reviews": resp.data.attributes.reviews_count,
                  "avg_reviews": resp.meta.reviews.average,
                  "branch_id": null,
                  "cuisine": resp.data.attributes.cuisine,
                  "location": resp.data.attributes.location,
                  "rank": 3,
                  "description": resp.data.attributes.description,
                  "custom_text": null,
                  "accept_voucher": resp.data.attributes.accept_voucher,
                  "name": multiName,
                  "names": item.names,
                  "total_covers": resp.data.attributes.total_covers,
                  "restaurant_id": item.restaurant_id,
                  "restaurant_encrypted_id": resp.data.attributes.slug,
                  "link": resp.data.attributes.link,
                  "cover": {
                    "thumb": resp.data.attributes.image_cover_url.thumb,
                    "slide_thumb": resp.data.attributes.image_cover_url.thumb,
                    "square": resp.data.attributes.image_cover_url.thumb,
                    "original":resp.data.attributes.image_cover_url.thumb
                  },
                  "last_booking_was_made": resp.data.attributes.last_booking_was_made,
                  "package_types": resp.data.attributes.available_package_types,
                  
                  "long_package_types": [
                    {
                      "type_short": "",
                      "type": ""
                    }
                  ],
                  "price": {
                    "amount": resp.data.attributes.price_and_pricing_type.amount,
                    "currency": "THB",
                    "symbol": "฿",
                    "format": `${resp.data.attributes.price_and_pricing_type.amount}฿`
                  },
                  "price_v2": {
                    "amount": resp.data.attributes.price_and_pricing_type.amount,
                    "currency": "THB",
                    "symbol": "฿",
                    "format": `${resp.data.attributes.price_and_pricing_type.amount}฿`
                  },
                  "pricing_type": resp.data.attributes.price_and_pricing_type.pricing_type,
                  "covid19_safety": false
                },
                
              }
        }
        
        data.push(attributes)
      }
    }
    const res = data;
    if (!result) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return res;
  }
}