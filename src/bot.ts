import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import { IBotContext } from "./context.interface";

const token = '5908482297:AAFBaxxOa7rLMyArvCKNVpJEuXb74IElHRE';

const bot: Telegraf = new Telegraf(token);

bot.use((new LocalSession({ database: '../sessions.json' })).middleware())

export default bot