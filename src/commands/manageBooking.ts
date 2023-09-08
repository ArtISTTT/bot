import { Context, Markup } from "telegraf"
import bot from "../bot"
import { buttonsList } from "../buttons"
import { AvailableSets, IBotContext, PreparationType, RentalPeriod } from "../context.interface"
import moment from "moment";

const trainingTypeToText = {
    group: 'Групповая тренировка',
    individual: 'Индивидуальная тренировка',
} as any;

const prepTypeToCost = {
    [PreparationType.skiSharpening]: 500,
    [PreparationType.bootMachining]: 300,
}

const prepTypeToText = {
    [PreparationType.skiSharpening]: 'Заточка лыж',
    [PreparationType.bootMachining]: 'Обработка ботинок',
}

const periodValueToText = {
    [RentalPeriod.twoHours]: '2 часа',
    [RentalPeriod.fourHours]: '4 часа',
    [RentalPeriod.oneDay]: '1 день',
    [RentalPeriod.twoDays]: '2 дня',
}

const rentTypeToText = {
    [AvailableSets.justBoots]: 'Ботинки',
    [AvailableSets.justSkis]: 'Лыжи',
    [AvailableSets.fullSet]: 'Полный комплект',
}

const rentTypeAndSetToCost = {
    [AvailableSets.justBoots]: {
        [RentalPeriod.twoHours]: 300,
        [RentalPeriod.fourHours]: 500,
        [RentalPeriod.oneDay]: 1000,
        [RentalPeriod.twoDays]: 1500,
    },
    [AvailableSets.justSkis]: {
        [RentalPeriod.twoHours]: 400,
        [RentalPeriod.fourHours]: 600,
        [RentalPeriod.oneDay]: 1100,
        [RentalPeriod.twoDays]: 1700,
    },
    [AvailableSets.fullSet]: {
        [RentalPeriod.twoHours]: 500,
        [RentalPeriod.fourHours]: 800,
        [RentalPeriod.oneDay]: 1500,
        [RentalPeriod.twoDays]: 2000,
    }
}

export const manageBookings = (ctx: Context) => {

    bot.telegram.sendMessage((ctx as any).chat.id, 'Управление записями', Markup.inlineKeyboard([
        [buttonsList.checkBookings],
        [buttonsList.checkRentals],
        [buttonsList.checkPreparations],
        [buttonsList.backButton('goToStart')],
    ]))
}

export const checkBookings = (ctx: IBotContext) => {
    const bookings = ctx.session.trainings || [];

    if (bookings.length === 0) {
        bot.telegram.sendMessage((ctx as any).chat.id, 'У вас нет записей на тренировки', Markup.inlineKeyboard([
            [buttonsList.backButton('manageBookings')],
        ]))
        return;
    }
    
    const traningToText = (training: {
        type: string;
        date: moment.Moment;
        isPayed: boolean;
        id: string;
    }) => {
        return `${trainingTypeToText[training.type]} ${moment(training.date).format('DD.MM.YYYY HH:mm')}\n`
    }

    bot.telegram.sendMessage((ctx as any).chat.id, `Ваши тренировки:\n${bookings.map(traningToText)}`, Markup.inlineKeyboard([
        [buttonsList.backButton('manageBookings')],
    ]))
}

export const checkPreparations = (ctx: IBotContext) => {
    const preparations = ctx.session.preparations || [];

    if (preparations.length === 0) {
        bot.telegram.sendMessage((ctx as any).chat.id, 'У вас нет снаряжения', Markup.inlineKeyboard([
            [buttonsList.backButton('manageBookings')],
        ]))
        return;
    }
    
    const preparationToText = (preparation: {
        type: PreparationType;
        cost: number;
        isPayed: boolean;
    }) => {
        return `${prepTypeToText[preparation.type]} ${preparation.cost} руб.\n`
    }

    bot.telegram.sendMessage((ctx as any).chat.id, `Ваше снаряжение на обработку:\n${preparations.map(preparationToText)}`, Markup.inlineKeyboard([
        [buttonsList.backButton('manageBookings')],
    ]))
}

export const checkRentals = (ctx: IBotContext) => {
    const rentals = ctx.session.rentals || [];

    if (rentals.length === 0) {
        bot.telegram.sendMessage((ctx as any).chat.id, 'У вас нет аренды', Markup.inlineKeyboard([
            [buttonsList.backButton('manageBookings')],
        ]))
        return;
    }
    
    const rentalToText = (rental: {
        set: AvailableSets;
        period: RentalPeriod;
        cost: number;
        isPayed: boolean;
    }) => {
        return `${rentTypeToText[rental.set]} ${periodValueToText[rental.period]} ${rental.cost} руб.\n`
    }

    bot.telegram.sendMessage((ctx as any).chat.id, `Ваше арендованное снаряжение:\n${rentals.map(rentalToText)}`, Markup.inlineKeyboard([
        [buttonsList.backButton('manageBookings')],
    ]))
}
