import { AvailableSets, IBotContext, PreparationType, RentalPeriod } from './../context.interface';
import { Context, Markup } from "telegraf"
import bot from "../bot"
import { buttonsList } from "../buttons"
import moment from "moment";
import { commandOnStart } from "./start";
// import { IBotContext } from "../context.interface";

const prepTypeToCost = {
    [PreparationType.skiSharpening]: 500,
    [PreparationType.bootMachining]: 300,
}

const prepTypeToText = {
    [PreparationType.skiSharpening]: 'Заточка лыж',
    [PreparationType.bootMachining]: 'Обработка ботинок',
}


// При клике на кнопку "Прокат лыжь и инвентаря" открывается меню выбора типа тренировки
export const rentEquipment = (ctx: Context) => {

    bot.telegram.sendMessage((ctx as any).chat.id, 'Что вас интересует?', Markup.inlineKeyboard([
        [buttonsList.equipmentRental],
        [buttonsList.equipmentPreparation],
        [buttonsList.backButton('goToStart')],
    ]))
}

export const equipmentRental = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Прокат лыж и инвентаря', Markup.inlineKeyboard([
        [buttonsList.knowAboutExistance],
        [buttonsList.rentPrice],
        [buttonsList.rentalPeriod],
        [buttonsList.backButton('rentEquipment')],
    ]))
}

export const knowAboutExistance = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Выбор комплекта', Markup.inlineKeyboard([
        [buttonsList.justBoots],
        [buttonsList.justSkis],
        [buttonsList.fullSet],
        [buttonsList.backButton('equipmentRental')],
    ]))
}

export const selectSet = (ctx: IBotContext, data: {set: AvailableSets}) => {
    ctx.session.set = data.set;

    const periods = [{text: '2 часа', value: RentalPeriod.twoHours}, {text: '4 часа', value: RentalPeriod.fourHours}, {text: '1 день', value: RentalPeriod.oneDay}, {text: '2 дня', value: RentalPeriod.twoDays}];

    const periodButtons = periods.map(period => [buttonsList.selectRentalPeriod(period.text, period.value)]).concat([[buttonsList.backButton('knowAboutExistance')]]);

    console.log(periodButtons);
    
    bot.telegram.sendMessage((ctx as any).chat.id, 'Выберите срок аренды', Markup.inlineKeyboard(periodButtons));
}

export const selectRentalPeriod = (ctx: IBotContext, data: {period: RentalPeriod}) => {
    ctx.session.rentalPeriod = data.period;

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

    const type = ctx.session.set;
    const period = ctx.session.rentalPeriod;

    if (!type || !period) {
        bot.telegram.sendMessage((ctx as any).chat.id, `Ошибка`, Markup.inlineKeyboard([
            [buttonsList.backButton('goToStart')]
        ]));

        return;
    }

    bot.telegram.sendMessage((ctx as any).chat.id, `Оплатите аренду за ${rentTypeToText[type]} на ${periodValueToText[period]}`, Markup.inlineKeyboard([
        [buttonsList.payForRental],
        [buttonsList.backButton('selectRentalPeriod', data)]
    ]));
}

export const payForRental = (ctx: IBotContext) => {
    bot.telegram.sendMessage((ctx as any).chat.id, `Оплачено!`, Markup.inlineKeyboard([
        [buttonsList.backButton('goToStart')]
    ]));
}

export const rentPrice = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Аренда полного комплекта:\n2 часа - 600р\n4 часа - 1000р \n1 день - 2400р \n2 дня - 4000р \n', Markup.inlineKeyboard([
        [buttonsList.backButton('equipmentRental')],
    ]))
}

export const rentalPeriod = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Аренда доступна на 2 часа / 4 часа / 1 день / 2 дня', Markup.inlineKeyboard([
        [buttonsList.backButton('equipmentRental')],
    ]))
}

export const equipmentPreparation = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Подготовка инвентаря для катания', Markup.inlineKeyboard([
        [buttonsList.skiSharpening],
        [buttonsList.bootMachining],
        [buttonsList.backButton('rentEquipment')],
    ]))
}

export const prepCost = (ctx: IBotContext, data: {t: PreparationType}) => {
    ctx.session.preparatinType = data.t;

    bot.telegram.sendMessage((ctx as any).chat.id, `Стоимость ${prepTypeToText[data.t]}: ${prepTypeToCost[data.t]} рублей\nСрок выполнения работы: 40 минут`, Markup.inlineKeyboard([
        [buttonsList.payForPreparation],
        [buttonsList.backButton('equipmentPreparation')],
    ]))
}

export const payForPreparation = (ctx: IBotContext) => {
    const type = ctx.session.preparatinType;

    if (!type) {
        bot.telegram.sendMessage((ctx as any).chat.id, `Ошибка`, Markup.inlineKeyboard([
            [buttonsList.backButton('goToStart')]
        ]));

        return;
    }

    bot.telegram.sendMessage((ctx as any).chat.id, `Поздравляем! Вы оплатили ${prepTypeToCost[type]} рублей за ${prepTypeToText[type]}!`, Markup.inlineKeyboard([
        [buttonsList.backButton('goToStart')],
    ]))
}
