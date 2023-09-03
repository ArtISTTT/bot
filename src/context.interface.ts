import { Context } from "telegraf";

export enum AvailableSets {
    justBoots = 'justBoots',
    justSkis = 'justSkis',
    fullSet = 'fullSet',
}

export enum RentalPeriod {
    twoHours = 'twoHours',
    fourHours = 'fourHours',
    oneDay = 'oneDay',
    twoDays = 'twoDays',
}

export enum PreparationType {
    skiSharpening = 'skiSharpening',
    bootMachining = 'bootMachining',
}

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
    set?: AvailableSets,
    rentalPeriod?: RentalPeriod,
    preparatinType?: PreparationType,
}

export interface IBotContext extends Context {
    session: SessionData;
}