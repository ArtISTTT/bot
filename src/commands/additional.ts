import { Context, Markup } from "telegraf"
import bot from "../bot"
import { buttonsList } from "../buttons"
import { AvailableSets, IBotContext, PreparationType, RentalPeriod } from "../context.interface"

export const additionalInformation = (ctx: Context) => {

    bot.telegram.sendMessage((ctx as any).chat.id, 'Дополнительная информация', Markup.inlineKeyboard([
        [buttonsList.reviews],
        [buttonsList.contacts],
        [buttonsList.support],
        [buttonsList.backButton('goToStart')],
    ]))
}

export const reviews = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Отзывы', Markup.inlineKeyboard([
        [buttonsList.backButton('additionalInformation')],
    ]))
}

export const contacts = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Контакты', Markup.inlineKeyboard([
        [buttonsList.backButton('additionalInformation')],
    ]))
}

export const support = (ctx: Context) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Поддержка', Markup.inlineKeyboard([
        [buttonsList.backButton('additionalInformation')],
    ]))
}