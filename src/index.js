import Bot from "./bot";
import { ask_ai } from "./ask_ai";
import { start } from "./commands/start";
import { Users } from "./database/models/Users";
import { Chats } from "./database/models/Chats";
import { sleep, strip_commands } from "./utils";
import { setup_run_command } from "./commands/run";
import { setup_ask_command } from "./commands/ask";
import { setup_gif_commands } from "./commands/gif";
import { setup_joke_command } from "./commands/joke";
import { setup_imdb_commands } from "./commands/imdb";
import { setup_poll_commands } from "./commands/poll";
import { setup_wall_commands } from "./commands/wall";
import { setup_flames_command } from "./commands/flames";
import { set_speak_x_commands } from "./commands/speak_x";
import { setup_cricket_commands } from "./commands/cricket";
import { setup_riddles_commands } from "./commands/riddles";
import { enable_chatbot_features } from "./features/chatbot";
import { setup_languages_commands } from "./commands/languages";
import { setup_adminlist_commands } from "./commands/adminlist";
import { setup_image_edit_commands } from "./commands/image_edit";
import { set_truth_or_dare_commands } from "./commands/truth_or_dare";
import { setup_group_management_commands } from "./commands/group_management";
import { save_analytics } from "./database/features/save_analytics";
import { config } from "./config";
import { sudoers } from "./info";

export const bot = new Bot();

// const MAIN_LOGGING_ENABLED = true;
const MAIN_LOGGING_ENABLED = false;
// export const LOG_GROUP = '@testttttttahsh';
export const LOG_GROUP = '-1002203575205';

//-------------------------

/*

truth - reply to someone use /truth r   to get crazy
dare - reply to someone /dare r   to get crazy
ri - get a riddle
riddle - get a riddle
wall - get a wallpaper eg: /wall 4
cric - get live cricket score
imdb - /imdb spiderman 
ask - /ask what is a cat
flames - reply to someone to know
pin - pin a message
dpin - pin a message deleting your command
joke - get a joke
gif - send a gif example /gif cat says hello
agif - send anime gif example /gif hello
tr - reply to translate a message
li - reply to know language of message
run - to run a message with code
cheat - reply to a a poll know
poll - send a poll format: /poll your question and options in next lines
choose - reply to a poll know
explain - reply to a poll to know
re - reply to a message to know
ban - reply to message or type username(s) and time
dban - reply to message or type username(s) and time
kick - reply to message or type username(s)
mute - reply to message or type username(s) and time
unmute - reply to message or type username(s)
removebg - reply to a message with media
admins - get list of admins
adminlists - get list of admins
speak_cow - write any message after this
speak_tux - write any message after this
speak_calvin - write any message after this
speak_cheese - write any message after this
speak_daemon - write any message after this
speak_duck - write any message after this
speak_kiss - write any message after this
speak_kitty - write any message after this
speak_milk - write any message after this
speak_lion - write any message after this
speak_moose - write any message after this
speak_pony - write any message after this
speak_ren - write any message after this
speak_skele - write any message after this
speak_stimpy - write any message after this
speak_pig - write any message after this
cow - write any message after this
tux - write any message after this
calvin - write any message after this
cheese - write any message after this
daemon - write any message after this
duck - write any message after this
kiss - write any message after this
kitty - write any message after this
milk - write any message after this
lion - write any message after this
moose - write any message after this
pony - write any message after this
ren - write any message after this
skele - write any message after this
stimpy - write any message after this
pig - write any message after this
setbio - set other user's bio
bio - get bio of self or others

*/


bot.on("/start", start);

//-------------------------------
setup_gif_commands();
setup_poll_commands();
setup_wall_commands();
setup_imdb_commands();
set_speak_x_commands();
setup_riddles_commands();
setup_cricket_commands();
setup_adminlist_commands();
setup_languages_commands();
setup_image_edit_commands();
set_truth_or_dare_commands();
setup_group_management_commands();


//-------------------------------
setup_run_command();
setup_ask_command();
setup_joke_command();
setup_flames_command();


//-------------------------------
enable_chatbot_features();

//-------------------------------
bot.on("/id", async (data) => {
	await bot.reply_text_to_md_mode(data,
		`
Chat ID : \`${data.chat.id}\`
`
	);
});


// Just to see which server its currently using
bot.on("/wh", async (data) => {
	if(sudoers.indexOf(data.from.username.toLowerCase()) != -1)
	{
		await bot.reply_text_to(data, JSON.stringify(await bot.getWebhookInfo(), null, 4));
	}
});

// Just to see number of users
bot.on("/users", async (data) => {
	if(sudoers.indexOf(data.from.username.toLowerCase()) != -1)
	{
		await bot.reply_text_to(data, `Total Users : ${await Users.countRows()}`);
	}
});

// Just to see number of users
bot.on("/groups", async (data) => {
	if(sudoers.indexOf(data.from.username.toLowerCase()) != -1)
	{
		await bot.reply_text_to(data, `Total Groups : ${await Chats.countRows()}`);
	}
});

bot.on("/drop_updates", async (data) => {
	if(sudoers.indexOf(data.from.username.toLowerCase()) != -1)
	{
		const {result} = await bot.getWebhookInfo();
		const {url} = result;
		const res = await bot.setWebhook(url, true);
		await bot.reply_text_to(data, `endpoint reach : ${res.ok} \n\nresult : ${res.result} \n\ndesc : ${res.description}`);
	}
});

bot.on("/setbio", async (data) => {

	if(!('reply_to_message' in data)) {
		return await bot.reply_text_to(data, 'Reply to someone.');
	}

	if(data.reply_to_message.from.is_bot)
	{
		if(data.reply_to_message.from == 'im_nezuko_bot')
		{
			return await bot.reply_text_to(data, "me? 🤭");
		}
		return await bot.reply_text_to(data, "he\'s a useless bot 🤭");
	}
		

	const text = strip_commands(data.text).trim();
	if(data.reply_to_message.from.id == data.from.id)
	{
		const messages = [
			'hehe 😁 changing your own bio is not allowed',
			'You cant set your own bio 😂 LOL.',
			'I wont change your own bio 🤣',
			'Nope ,im not doing that 😆'
		];
		return await bot.reply_text_to(data, messages[Math.floor(Math.random() * messages.length)]);
	}

	if(text.length == 0) {
		return await bot.reply_text_to(data, 'usage : /setbio <some message>');
	}
	
	if(text.length >= 100) {
		return await bot.reply_text_to(data, 'too lengthy bio 🙄');
	}
	
	const id = data.reply_to_message.from.id;
	const set_bio = text;
	const success = await Users.setBio({id, set_bio});

	if(!success) {
		return;
	}
	await bot.reply_text_to(data, '👍 okey... done')
});

bot.on("/bio", async (data) => {

	let id = data.from.id;
	let name = data.from.first_name;
	if('reply_to_message' in data) {
		id = data.reply_to_message.from.id;
		name = data.reply_to_message.from.first_name;

		if(data.reply_to_message.from.is_bot)
		{
			if(data.reply_to_message.from == 'im_nezuko_bot')
			{
				return await bot.reply_text_to(data, "me? 🤭");
			}
			return await bot.reply_text_to(data, "he\'s a useless bot 🤭");
		}
		
	}
	
	const bio = await Users.getBio({id});

	if(!bio || !bio.set_bio)
	{
		return await bot.reply_text_to(data, 'no bio set.\n use /setbio');
	}
	
	await bot.reply_text_to(data,`
${name} 's  BIO 

${bio.set_bio}
	`);

});

// ping the broadcast server


bot.on("/bping", async (data) => {
	try {
		const res = await fetch(config.long_running_server_url).then(r=>r.text());
		await bot.reply_text_to(data, `bping status : ${res}`);
	} catch(err) {
		await bot.reply_text_to(data, `bping err : ${JSON.stringify(err, null, 4)}`);
	}
});

bot.on("/broadcast", async (data) => {
	if(sudoers.indexOf(data.from.username.toLowerCase()) != -1)
	{
		if(!('reply_to_message' in data)) return;
		if(!('text' in data.reply_to_message)) return;

		const chats = await Chats.getAllChats();
		// const chats = [{ id: -1002230897027}];
		const callback = (await bot.reply_text_to(data, `Broadcast Initiated`)).result;
		await broadcast(chats, data, callback);
	}
});

async function broadcast(chats, data, callback)
{
	const bot_token = await bot.getBotToken();
	// see if we can skip await ? or terminate after few seconds
	const proms = [];
	proms.push(fetch(`${config.long_running_server_url}/broadcast`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				bot_token,
				chats,
				data,
				callback,
			}),
		}
	));

	proms.push(sleep(5000)); // 5 seconds

	await Promise.race(proms);
}

// async function broadcast(chats, data)
// {
// 	const proms = [];
// 	chats.forEach(({id}) => {
// 		const chat_id = id;
// 		proms.push(bot.sendMessage({chat_id}, data.reply_to_message.text));
// 	});
// 	const res = await Promise.all(proms);
// 	console.log(res);
// 	return res;
// }






bot.on("/ping", async (data) => {
	console.log('/ping', data);

	let then = performance.now();
	let res = await bot.reply_text_to(data, "Pong 🏓!");
	console.log(res);

	let dt = performance.now() - then;
	await bot.editMessageText(res.result, `Pong Time : ${dt}ms !`);
});


bot.on('brb', async (data) => {
	console.log(await bot.reply_text_to(data, "bye, take care."));
});







bot.on('/re', async (data) => {
	if (!('reply_to_message' in data)) {
		return;
	}

	const emojis = ["👎", "❤", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆", "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈", "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡", "👍"].sort(() => (Math.random() - 0.5));

	let reaction = data.text.substr(3);
	// console.log('my rexn ',reaction);
	if (!reaction || !(reaction in emojis)) {

		reaction = await ask_ai(`
		choose a most suitable and most relevent reaction form 
		available reaction for the text below.
		
		Text : ${data.reply_to_message.text}
		
		
		
		
		Available Reactions : ${emojis.join(" ")}
		
		
		
		you should "strictly" "only" return emoji from "available reactions" 
		you shouldnt react with any other emoji than available reactions
		`);

	} else {
		reaction = ask_ai(`echo back just the emoji from this text :  ${data.text}`)
	}
	const res = await bot.setMessageReaction(data, reaction);
	console.log(res);
})

bot.on('/delete', async (data) => {
	if (sudoers.indexOf(data.from.username.toLowerCase()) == -1) return;

	const { reply_to_message } = data;
	if (!reply_to_message) return;
	if (reply_to_message.from.username != 'im_nezuko_bot') return;
	const { chat, message_id } = reply_to_message;
	const chat_id = chat.id;
	await bot.deleteMessage({ message_id, chat_id });
})









/**
 * 
 * @param {Request} request 
 * @param {*} env 
 * @param {*} ctx 
 * @returns {Response}
 */
async function main(request, env, ctx) {
	const { url } = request;
	console.log("----- Main() --------");
	const bot_token = env.TG_BOT_API_TOKEN;
	const owner_id = env.TG_BOT_OWNER_ID;
	bot.config({ bot_token, owner_id });

	if(url.endsWith('/setWebhook'))
	{
		console.log("----- Set Webhook() --------");
		const rootRegex = new RegExp(/(https?:\/\/[^\\]{0,}\/)/);
		const rootPath = rootRegex.exec(url)[0];
		const res = await bot.setWebhook(rootPath);
		console.log(res);
		return new Response(JSON.stringify(res));
	} else {
		try {
			const json = await request.json();
			if (MAIN_LOGGING_ENABLED) {
				console.log('request recieved: ', json);
			}
			await bot.respond_to(json);			
			await save_analytics(json.message);

		} catch (err) {
			console.log("Error:", err);
		}
	}

	return new Response('{}');
}




export default {
	fetch: main,
};
