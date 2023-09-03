import { Context, Markup } from "telegraf"
import bot from "../bot"
import { buttonsList } from "../buttons"
import { IBotContext } from "../context.interface";

export const commandOnStart = (ctx: IBotContext) => {
    bot.telegram.sendMessage((ctx as any).chat.id, 'Добро пожаловать! Что вас интересует?', Markup.inlineKeyboard([
            [buttonsList.bookTraining],
            [buttonsList.rentSki],
            [buttonsList.manageBooking],
            [buttonsList.additionalInformation],
        ])
    )
}