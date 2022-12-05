import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { IRecommendation } from 'src/interface/recommendation.interface';
import { Model,now } from "mongoose";
import moment = require('moment');
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import axios from "axios";


@Processor('recommendation-queue')
export class RecommendationProcessor {
    constructor(
        @InjectModel("Recommendation")
        private recommendationModel: Model<IRecommendation>) { }

    @Process('recommendation')
    async handleRecommendationJob(job: Job) {

        let priceAndPricingType;
        let res;
        let names;
        let location;

        const currDate = new Date();
        const now = moment(currDate).format('YYYY-MM-DD HH:mm:ss');
        let cuisineId;
        const restaurantId = job.data.profiles[0] ? job.data.profiles[0].key_values.restaurantId: 0;
        const clevertapId = job.data.profiles[0] ? job.data.profiles[0].objectId : null;
        const userId = job.data.profiles[0] ? job.data.profiles[0].key_values.clevertapId : 0;
        let rank = job.data.key_values ? job.data.key_values.rank : null;
        let startDate = job.data.key_values ? job.data.key_values.startDate : null;
        let name = job.data.profiles[0] ? job.data.profiles[0].key_values.name : null;
        let reviewScore = job.data.key_values ? job.data.key_values.reviewsScore : null;
        let reviewCount = job.data.key_values ? job.data.key_values.reviewsCount : null;
        let imageCoverUrl = null;
        let acceptVoucher = false;
        let cuisine = job.data.key_values ? job.data.key_values.cuisine : null;

        // const url =`${process.env.HH_URI}${restaurantId}.json`
        // const url = `https://hhstaging.hungryhub.com/api/v5/restaurants/${restaurantId}.json`;
        const url = `https://hhstaging.hungryhub.com/api/v5/restaurants/${restaurantId}.json`;
        const response =  await axios.get(url);
        if (response.status === 200) {
        res = response.data;
        priceAndPricingType = res.data.attributes.price_and_pricing_type || null;
        acceptVoucher  = res.data.attributes.accept_voucher || null;
        names = res.data.attributes.names || null;
        location = res.data.attributes.primary_location || null;
        }
        cuisineId = res.data.attributes.primary_cuisine.id || null;
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
            await this.recommendationModel.create({
                restaurant_id: restaurantId,
                cuisine_id: cuisineId,
                clevertap_id: clevertapId,
                user_id: userId,
                names: names,
                name: name,
                reviews_count: reviewCount,
                reviews_score: reviewScore,
                primary_location: location,
                rank: rank,
                start_date: startDate,
                created_date:  moment(now).toDate(),
                updated_date:  moment(now).toDate(),
                accept_voucher: acceptVoucher,
                price_and_pricing_type: priceAndPricingType,
                image_cover_url: imageCoverUrl,

            });
            
        }
    }