import { Context, Markup } from "telegraf"
import bot from "../bot"
import { buttonsList } from "../buttons"
import { availableTrainers } from "../helpers/availableTrainers";
import moment from "moment";
import { IBotContext } from "../context.interface";
import { commandOnStart } from "./start";
// import { IBotContext } from "../context.interface";

// При клике на кнопку "Записаться на тренировку" открывается меню выбора типа тренировки
export const bookTraining = (ctx: Context) => {
    console.log('booking');

    bot.telegram.sendMessage((ctx as any).chat.id, 'Выберите тип тренировки', Markup.inlineKeyboard([
        [buttonsList.groupTraining],
        [buttonsList.individualTraining],
    ]))
}

// При клике на кнопку индивидуальной тренировки открывается меню выбора тренера
export const individualTraining = (ctx: IBotContext) => {
    console.log('individualTraining');
    ctx.session.currentTrainerId = undefined;

    bot.telegram.sendMessage((ctx as any).chat.id, 'Выбор тренера', {
        reply_markup: {
            inline_keyboard: [
                availableTrainers.map((trainer) => {
                    return buttonsList.selectTrainer(trainer.id)
                })
            ]
        }
    })
}

// При клике на тренера открывается информация о нем
export const informationAboutTrainer = (ctx: IBotContext, data: {trainerId: number}) => {
    console.log(data);

    const trainer = availableTrainers.find((trainer) => trainer.id === data.trainerId);

    ctx.session.currentTrainerId = data.trainerId;
    
    bot.telegram.sendMessage((ctx as any).chat.id, trainer?.info ?? 'Информация не найдена', Markup.inlineKeyboard([
        [buttonsList.selectTrainingDate(data.trainerId)],
        [buttonsList.selectAnotherTrainer],
    ]))
}

// При клике на кнопку "Выбрать дату тренировки" открывается меню выбора даты тренировки
export const selectTrainingDate = (ctx: IBotContext, data: {trainerId: number}) => {
    const trainer = availableTrainers.find((trainer) => trainer.id === data.trainerId);

    const availableDates = [];

    const today = moment().locale('ru');
    for (let i = 0; i < 7; i++) {
        // пример: Понедельник, 1-е февраля
        availableDates.push(today.clone().add(i, 'days'))
    }

    const availableDateButtons = availableDates.map(date => [buttonsList.availableDateButton(date)])

    bot.telegram.sendMessage((ctx as any).chat.id, 'Выберите ближайшую дату тренировки:', Markup.inlineKeyboard(availableDateButtons))
}

// При клике на кнопку на Дату тренировки открывается меню выбора времени тренировки
export const selectAvailableDate = (ctx: IBotContext, data: {trainerId: number, date: string}) => {
    const trainer = availableTrainers.find((trainer) => trainer.id === ctx.session.currentTrainerId);

    const availableTimes = trainer?.availableTime ?? [];

    ctx.session.currentDate = moment(data.date);

    console.log(availableTimes);

    const availableTimeButtons = availableTimes.filter(time => {
        const date = (ctx.session.currentDate ?? moment()).set({ hour: time });

        const isPast = date.isBefore(moment());

        return !isPast;
    }).map(time => [buttonsList.availableTimeButton(time)])

    console.log(trainer);

    bot.telegram.sendMessage((ctx as any).chat.id, 'Выберите время тренировки:', Markup.inlineKeyboard(availableTimeButtons))
}

export const selectAvailableTime = (ctx: IBotContext, data: {time: number}) => {
    const trainer = availableTrainers.find((trainer) => trainer.id === ctx.session.currentTrainerId);

    const date = (ctx.session.currentDate ?? moment()).set({ hour: data.time }).locale('ru');

    ctx.session.currentDate = date;

    bot.telegram.sendMessage((ctx as any).chat.id, `Вы выбрали ${ctx.session.currentDate?.format('dddd, D MMMM')} в ${data.time}:00`, Markup.inlineKeyboard([
        [buttonsList.confirmIndividualTraining],
    ]))
}

export const confirmIndividualTraining = (ctx: IBotContext) => {
    const id = Math.random().toString(36).substr(2, 9);

    ctx.session.trainings = (ctx.session.trainings ?? []).concat({
        type: 'individual',
        date: ctx.session.currentDate ?? moment(),
        isPayed: false,
        id,
    });

    ctx.session.currentPayingTrainingId = id;

    bot.telegram.sendMessage((ctx as any).chat.id, `Подтверждено! Оплатите тренировку`, Markup.inlineKeyboard([
        [buttonsList.payForIndividualTraining],
    ]));
}

export const payForIndividualTraining = (ctx: IBotContext) => {
    const trainingIndex = ctx.session.trainings?.findIndex((training) => training.id === ctx.session.currentPayingTrainingId);

    if (!ctx.session.trainings || !trainingIndex || trainingIndex < 0) {
        return;
    }

    ctx.session.trainings[trainingIndex].isPayed = true;
    ctx.session.currentPayingTrainingId = undefined;
    ctx.session.currentDate = undefined;
    ctx.session.currentTrainerId = undefined;

    bot.telegram.sendMessage((ctx as any).chat.id, `Тренировка оплачена!`, Markup.inlineKeyboard([
        [buttonsList.goToStart],
    ]))
}

export const goToStart = (ctx: IBotContext) => {
    commandOnStart(ctx);
}

// При клике на кнопку групповой тренировки открывается меню доступных групповых тренировок
export const groupTraining = (ctx: IBotContext) => {
    ctx.session.currentTrainerId = undefined;

    const availableDates = [];

    const today = moment().locale('ru');
    for (let i = 0; i < 7; i++) {
        // пример: Понедельник, 1-е февраля
        availableDates.push(today.clone().add(i, 'days'))
    }


    const availableDateButtons = availableDates.map(date => [buttonsList.availableGroupDateButton(date)])

    bot.telegram.sendMessage((ctx as any).chat.id, 'Тренировки проводятся ежедневно в 10:00, 13:00, 18:00 и 20:00. Выберите желаемую дату:', Markup.inlineKeyboard(availableDateButtons))
}

export const selectAvailableGroupDate = (ctx: IBotContext, data: {date: string}) => {

    const availableTimes = [{time: 10, free: 0}, {time: 13, free: 4}, {time: 18, free: 2}, {time: 20, free: 7}];

    ctx.session.currentDate = moment(data.date);

    const availableTimeButtons = availableTimes.map(time => [buttonsList.availableGroupTimeButton(time.time, time.free)])

    bot.telegram.sendMessage((ctx as any).chat.id, 'Выберите время тренировки:', Markup.inlineKeyboard(availableTimeButtons))

}

export const selectAvailableGroupTime = (ctx: IBotContext, data: {time: number}) => {
    ctx.session.currentDate = (ctx.session.currentDate ?? moment()).set({ hour: data.time }).locale('ru');

    bot.telegram.sendMessage((ctx as any).chat.id, `Вы выбрали ${ctx.session.currentDate?.format('dddd, D MMMM')} в ${data.time}:00`, Markup.inlineKeyboard([
        [buttonsList.confirmGroupTraining],
    ]))
}

export const selectAvailableGroupTimeNotAble = (ctx: IBotContext, data: {time: number, able: boolean}) => {
    bot.telegram.sendMessage((ctx as any).chat.id, `Свободных мест нет. Вам прийдет уведомление если они появятся`, Markup.inlineKeyboard([
        [buttonsList.goToStart],
    ]))
}

export const confirmGroupTraining = (ctx: IBotContext) => {
    const id = Math.random().toString(36).substr(2, 9);

    ctx.session.trainings = (ctx.session.trainings ?? []).concat({
        type: 'group',
        date: ctx.session.currentDate ?? moment(),
        isPayed: false,
        id,
    });

    ctx.session.currentPayingTrainingId = id;

    bot.telegram.sendMessage((ctx as any).chat.id, `Подтверждено! Оплатите групповую тренировку`, Markup.inlineKeyboard([
        [buttonsList.payForGroupTraining],
    ]));
}

export const payForGroupTraining = (ctx: IBotContext) => {
    const trainingIndex = ctx.session.trainings?.findIndex((training) => training.id === ctx.session.currentPayingTrainingId);

    if (!ctx.session.trainings || !trainingIndex || trainingIndex < 0) {
        return;
    }

    ctx.session.trainings[trainingIndex].isPayed = true;
    ctx.session.currentPayingTrainingId = undefined;
    ctx.session.currentDate = undefined;
    ctx.session.currentTrainerId = undefined;

    bot.telegram.sendMessage((ctx as any).chat.id, `Тренировка оплачена!`, Markup.inlineKeyboard([
        [buttonsList.goToStart],
    ]))
}
