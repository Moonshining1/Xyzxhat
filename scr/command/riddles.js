import { bot } from "..";
import { getRiddle } from "../getRiddle";

export function setup_riddles_commands()
{
    bot.on('/ri', handle_riddle);
    bot.on('/riddle', handle_riddle);
}

async function handle_riddle (data)
{
	const {riddle, answer} = await getRiddle();
	const res = `${riddle}

<span class="tg-spoiler">${answer}</span>
`
	await bot.reply_text_to_html_mode(data, res);
}
