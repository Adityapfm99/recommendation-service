import { Document } from 'mongoose';

export interface IRecommendation extends Document{
    readonly clevertapId: string;

    readonly cuisineIds: any;

    readonly createdDate: Date;

    readonly updatedDate: Date;

}
