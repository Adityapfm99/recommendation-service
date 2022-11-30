import { Document } from 'mongoose';

export interface IRecommendation extends Document{
    readonly clevertap_id: string;

    readonly restaurant_id: string;

    readonly cuisine_id: string;

    readonly names: string;

    readonly name: string;

    readonly image_cover_url: any;

    readonly location: any;

    readonly cuisine: string;

    readonly reviews_count: string;

    readonly reviews_score: string;

    readonly price_and_pricing_type: any;

    readonly accept_voucher: boolean;

    readonly user_id: string;

    readonly created_date: Date;

    readonly updated_date: Date;

}
