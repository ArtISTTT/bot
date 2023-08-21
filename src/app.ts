import express from 'express';
import {commandOnStart} from './commands/start';
import bot from './bot';
import commands from './commands';
import { isJsonString } from './helpers/isJsonString';
import { session } from 'telegraf';
import { IBotContext } from './context.interface';

// This is the route your Telegram bot will listen on
const app = express();

// Parse updates sent to the bot webhook
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.command('start', (ctx: any) => commandOnStart(ctx));

bot.action(/.*/, async (ctx: any) => {
    const callbackData = (ctx.callbackQuery as any).data

    if (isJsonString(callbackData)) {
        const callbackData: {
            type: keyof typeof commands;
            data: any
        } = JSON.parse((ctx.callbackQuery as any).data);

        const handler = commands[callbackData.type];

        handler(ctx, callbackData.data)
    } else {
        const handler = (commands as any)[callbackData];

        handler(ctx)
    }
    
})

bot.launch();
