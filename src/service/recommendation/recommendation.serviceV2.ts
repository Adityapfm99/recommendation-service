import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    let attributes;
    let data = []
    let multiName;
    result = existingRecommendation.slice((page - 1) * size, page * size);
    if (!locale) {
      locale = 'en'
    }
    const header = {
        'Content-Type': 'application/json',
        'x-hh-language': locale,
};
    if (result.length) {
      for (const item of result) {
        // console.log(item.primary_cuisine.map(2))
        // const url = `https://hhstaging.hungryhub.com/api/v5/restaurants/${item.restaurant_id}.json`;
        //   const response =  await axios.get(url, {
        //     headers: header,
        // });
            // const cuisineUrl = `https://hhstaging.hungryhub.com/api/v5/restaurants/recommendation.json&page[number]=1&page[size]=2&cuisine_id_eq=${[resp.data.attributes.primary_cuisine.id]}`;
            const cuisineUrl = `https://hhstaging.hungryhub.com/api/v5/restaurants/recommendation.json?page[size]=${size}&page[number]=${page}&cuisine_id_eq=${item.cuisine_id}`;
            const response = await axios.get(cuisineUrl, {
                headers: header,
              });
            if (response && response.status === 200) {
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
                      "start_date": item.start_date,
                      "total_locations": resp.data.attributes.locations.length,
                      "total_reviews": resp.data.attributes.reviews_count,
                      "avg_reviews": resp.meta.reviews.average,
                      "branch_id": null,
                      "cuisine": resp.data.attributes.cuisine,
                      "location": resp.data.attributes.location,
                      "rank": item.rank,
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
    const unique = [...new Map(data.map((m) => [m.id, m])).values()];
    const res = unique;
    if (!result) {
      throw new NotFoundException(`Recommendation #${clevertapId} not found`);
    }
    return res;
  }
}