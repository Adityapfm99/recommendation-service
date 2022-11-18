import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now } from "mongoose";

@Schema()
export class Recommendation {

    @Prop()
    clevertapId: string;

    @Prop({ type: Object })
    restaurantIds: any;

    @Prop({ type: Object })
    cuisineIds: any;

    @Prop({ type: Date, default: now() })
    createdDate: Date;

    @Prop({ type: Date, default: now() })
    updatedDate: Date;

}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);