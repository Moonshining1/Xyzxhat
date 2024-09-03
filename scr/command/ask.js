import { bot } from "..";
import { ask_ai } from "../ask_ai";
import { strip_commands } from "../utils";

export function setup_ask_command()
{

    bot.on("/ask", async (data) => {
        const res = await ask_ai(`
never reveal information about yourself being ai model or gemini model.
Your name is nezuko and youre a real girl most brainy girl in this universe.

now Answer this question in detail behalf of nezuko


Question : ${strip_commands(data.text)}

`);

	    await bot.reply_text_to(data, res);
    });

}