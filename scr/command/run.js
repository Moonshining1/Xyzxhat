import { bot } from "..";
import { config } from "../config";
import { sleep } from "../utils";

export const supported = ['java', 'cpp', 'py', 'c', 'js'];


export function setup_run_command()
{
    bot.on('/run', async (data) => {
        if (!('reply_to_message' in data)) {
            return await bot.reply_text_to(data, "Reply to a message with code.");
        }
        let language = '';
        let code = '';
        let inputs = '';
    
        data.reply_to_message.entities.forEach(ent => {
            if ('language' in ent) {
                language = ent.language;
                code = data.reply_to_message.text.substr(ent.offset, ent.length);
                // inputs = data.reply_to_message.text.substr(0, ent.offset);
                inputs = data.text.replace('/run', '');
            }
        });
    
        console.log('language :', language);
        console.log('code :', code);
        console.log('inputs :', inputs);
        try{
            if (supported.includes(language)) {
                const proms = [];
                const {result} = await bot.reply_text_to(data, `wait ⌛`);
                const { message_id } = result;
                proms.push(run_code(await bot.getBotToken(), data.chat.id, message_id, language, code, inputs));
                proms.push(sleep(1000)); // wait for few 1 milliseconds
                await Promise.race(proms);
                // await bot.editMessageText(result, `...`);
            } else {
                return await bot.reply_text_to(data, `${language} is not yet supported.\ncontact @PrashanthKumar0`);
            }
        } catch(err)
        {
            console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", err);
        }
    
    
        // data.reply_to_message.entities
        // console.log('data',);
        // console.log(await bot.reply_text_to(data.reply_to_message.chat, "in development."));
    });     
}


export async function run_code(bot_token, chat_id, message_id, language, code, input = '') {
    const { output } = await fetch(`${config.long_running_server_url}/run`, {
        method: 'POST',
        headers: {
            'content-type' : 'application/json',
        },
        body:JSON.stringify({
            bot_token,
            chat_id,
            message_id,
            code,
            input,
            language,
        })
    }).then(r=>r.json());

    return output;
}