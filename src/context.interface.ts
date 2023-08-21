import { Context } from "telegraf";

export interface SessionData {
    currentTrainerId?: number;
    currentDate?: moment.Moment;
    trainings?: {
        type: string;
        date: moment.Moment;
        isPayed: boolean;
        id: string;
    }[];
    currentPayingTrainingId?: string;
}

export interface IBotContext extends Context {
    session: SessionData;
}