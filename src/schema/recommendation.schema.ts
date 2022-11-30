import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now } from "mongoose";

@Schema()
export class Recommendation {

    @Prop()
    clevertap_id: string;

    @Prop()
    restaurant_id: string;

    @Prop()
    cuisine_id: string;

    @Prop({type: Map})
    names: string;

    @Prop()
    name: string;

    @Prop({type: Map})
    primary_location: string;

    @Prop({type: Map})
    primary_cuisine: string;

    @Prop()
    reviews_count: string;

    @Prop()
    reviews_score: string;

    @Prop({type: Map})
    price_and_pricing_type: string;

    @Prop({type: Map})
    image_cover_url:any;

    @Prop()
    accept_voucher : boolean;

    @Prop()
    user_id: string;

    @Prop({ type: Date, default: now() })
    created_date: Date;

    @Prop({ type: Date, default: now() })
    updated_date: Date;

}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);