import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now } from "mongoose";

@Schema()
export class Recommendation {

    @Prop()
    clevertapId: string;

    @Prop()
    restaurantId: string;

    @Prop()
    cuisineId: string;

    @Prop()
    userId: string;

    @Prop({ type: Date, default: now() })
    createdDate: Date;

    @Prop({ type: Date, default: now() })
    updatedDate: Date;

}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);