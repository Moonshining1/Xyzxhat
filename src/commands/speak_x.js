import { bot } from "..";
import { calvin, cheese, cow, daemon, duck, elephant, hello_kitty, kiss, lion, milk, moose, pig, pony, ren, say, skele, stimpy, tux } from "../cowsay";







export function set_speak_x_commands() {	

	bot.on('/speak_cow', speak_cow);
	bot.on('/cow', speak_cow);

	bot.on('/speak_tux', speak_tux);
	bot.on('/tux', speak_tux);

	bot.on('/speak_calvin', speak_calvin);
	bot.on('/calvin', speak_calvin);


	bot.on('/speak_cheese', speak_cheese);
	bot.on('/cheese', speak_cheese);


	bot.on('/speak_daemon', speak_daemon);
	bot.on('/daemon', speak_daemon);

	bot.on('/pig', speak_pig);
	bot.on('/speak_pig', speak_pig);


	bot.on('/speak_duck', speak_duck);
	bot.on('/duck', speak_duck);


	bot.on('/speak_elephant', speak_elephant);
	bot.on('/elephant', speak_elephant);


	bot.on('/speak_kiss', speak_kiss);
	bot.on('/kiss', speak_kiss);

	bot.on('/speak_kitty', speak_kitty);
	bot.on('/kitty', speak_kitty);

	bot.on('/speak_milk', speak_milk);
	bot.on('/milk', speak_milk);


	bot.on('/speak_lion', speak_lion);
	bot.on('/lion', speak_lion);


	bot.on('/speak_moose', speak_moose);
	bot.on('/moose', speak_moose);

	bot.on('/speak_pony', speak_pony);
	bot.on('/pony', speak_pony);

	bot.on('/speak_ren', speak_ren);
	bot.on('/ren', speak_ren);

	bot.on('/speak_skele', speak_skele);
	bot.on('/skele', speak_skele);

	bot.on('/speak_stimpy', speak_stimpy);
	bot.on('/stimpy', speak_stimpy);


	// bot.on('/ghost', async (data) => {
	// 	console.log(await cow_say(data, ghost));
	// });

	// bot.on('/dragon2', async (data) => {
	// 	console.log(await cow_say(data, dragon_and_cow));
	// });

	// bot.on('/banana', async (data) => {
	// 	await cow_say(data, banana);
	// });

}

















const speak_cow = async (data) => {
	await cow_say(data, cow);
}

const speak_tux = async (data) => {
	await cow_say(data, tux);
}

const speak_calvin =  async (data) => {
	await cow_say(data, calvin);
}

const speak_cheese =  async (data) => {
	console.log(await cow_say(data, cheese));
}

const speak_daemon =  async (data) => {
	console.log(await cow_say(data, daemon));
}

const speak_pig =  async (data) => {
	console.log(await cow_say(data, pig));
}

const speak_duck = async (data) => {
	console.log(await cow_say(data, duck));
}

const speak_elephant = async (data) => {
	console.log(await cow_say(data, elephant));
}

const speak_kiss =  async (data) => {
	console.log(await cow_say(data, kiss));
}

const speak_kitty = async (data) => {
	console.log(await cow_say(data, hello_kitty));
}

const speak_milk = async (data) => {
	console.log(await cow_say(data, milk));
}

const speak_lion = async (data) => {
	console.log(await cow_say(data, lion));
}

const speak_moose = async (data) => {
	console.log(await cow_say(data, moose));
}

const speak_pony = async (data) => {
	console.log(await cow_say(data, pony));
}

const speak_ren = async (data) => {
	console.log(await cow_say(data, ren));
}

const speak_skele = async (data) => {
	console.log(await cow_say(data, skele));
}

const speak_stimpy = async (data) => {
	console.log(await cow_say(data, stimpy));
}














async function cow_say(data, callback)
{
	let txt = data.text.split(' ').filter((_,i)=>i!=0).join(' ');
	if(txt.length == 0 && 'reply_to_message' in data)
	{
		if('text' in data.reply_to_message)
		{
			txt = data.reply_to_message.text;
		}
	}
	const payload = say(txt, callback).replace(/</gmi,'&lt;').replace(/>/gmi,'&gt;');
	const res = await bot.reply_text_to_html_mode(data, '<pre>'+ payload +'</pre>');
	console.log(res);
}