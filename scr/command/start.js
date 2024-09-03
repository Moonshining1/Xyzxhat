import { bot } from "..";

export const start = async (data) => {
	await bot.reply_text_to(data, 'hello 👋');
}