import { Document } from 'mongoose';

export interface IRecommendation extends Document{
    readonly clevertapId: string;

    readonly restaurantId: string;

    readonly cuisineId: string;

    readonly createdDate: Date;

    readonly updatedDate: Date;

}
