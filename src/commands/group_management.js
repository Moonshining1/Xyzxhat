import { bot, LOG_GROUP } from "..";
import { makeTime } from "../makeTime";
import { getUserId } from "../getUserId";



export function setup_group_management_commands()
{
    bot.on('/ban', async (data)=>{
        await banUser(data);
    });
    
    bot.on('/dban', async (data)=>{
        await banUser(data, true);
    });
    
    
    bot.on('/unban', async (data)=>{
        await unbanUser(data);
    });
    
    
    bot.on('/kick', async (data)=> {
        await unbanUser(data, false);
    });
    
    bot.on('/mute', async (data)=> {
        await muteUnmute(data, true);
    });
    
    bot.on('/unmute', async (data)=> {
        await muteUnmute(data, false);
    });
    
    
	// TODO : combine pin / dpin in single function
	bot.on("/pin", pin);
	
	bot.on("/dpin", dpin);
	
}



async function pin(data) {

	if (!('reply_to_message' in data)) {
		await bot.reply_text_to(data, "Reply to a message to pin it.");
	}


	const user_id = data.from.id;
	const chat_id = data.chat.id;
	const permission = bot.PERMISSION.can_pin_messages;
	const can_perform_action = await bot.can_user_perform_action({ user_id, chat_id, permission });

	if (can_perform_action) {
		const message_id = data.reply_to_message.message_id;
		// console.log("message id :", message_id);
		console.log("res", await bot.pinChatMessage({ chat_id, message_id }));
	} else {
		await bot.reply_text_to(data, "Either You or I Have No Permission To Pin Messages.");
	}
}

async function dpin(data) {
	if (!('reply_to_message' in data)) {
		await bot.reply_text_to(data, "Reply to a message to pin it.");
	}


	const user_id = data.from.id;
	const chat_id = data.chat.id;
	const permission = bot.PERMISSION.can_pin_messages;
	const can_perform_action = await bot.can_user_perform_action({ user_id, chat_id, permission });

	if (can_perform_action) {
		const message_id = data.reply_to_message.message_id;
		// console.log("message id :", message_id);
		console.log("res", await bot.pinChatMessage({ chat_id, message_id }));
	} else {
		await bot.reply_text_to(data, "Either You or I Have No Permission To Pin Messages.");
	}

	const message_id = data.message_id;
	console.log("Delete : ", await bot.deleteMessage({ chat_id, message_id }));
}



async function banUser(data, revoke_messages = false) {
	console.log(JSON.stringify(data, null, 4));
	
	const {text} = data;

	const can_ban = await bot.can_user_perform_action({user_id : data.from.id , chat_id : data.chat.id, permission : bot.PERMISSION.can_restrict_members});
	if(!can_ban)
	{
		const replies = [
			'lol',
			'😂😂😂 kiddo',
			'Okay.. then?',
			'uff... 😭😭😭',
			'hmm.. but why?',
			'what ?? really ?',
			'you cant do it... hehe 😂',
		];
		return await bot.reply_text_to(data, replies[Math.floor(Math.random() * replies.length)]);
	}


	const txt = text.split(' ').filter((_,i) => i != 0);
	const user_ids = [];
	for(let tok of txt)
	{
		if(tok.startsWith('@'))
		{
			user_ids.push(await getUserId(tok));
		}
	}

	if(user_ids.length != 0 )
	{
		const times = text.split(' ')
		.filter((t, idx) => (idx != 0 && t.match(/(\d+m|\d+h|\d+d)/gmi)))
		.map(time=>time.length > 0 ? makeTime(time[0]) : 0);

		const params = user_ids.map((uid,idx)=>{
			const p = {
				chat_id : data.chat.id,
				user_id: uid,
			};
			
			if(idx < times.length)
			{
				p.until_date = times[idx];
			}

			return p;
		});

		const proms = [];
		for(let param of params)
		{
			proms.push(bot.tryBan(param));
		}
		const res = await Promise.all(proms);

		await bot.sendMessage(
			{chat_id : LOG_GROUP},

			'++++  BANNED ++++ \n\n'
			+ 'params : ' + JSON.stringify(params, null, 4)
			+ '\n\n'
			+ 'data : '+JSON.stringify(data, null, 4)
			+ '\n\n'
			+ 'res : '+JSON.stringify(res, null, 4)
		);

		return;
	}


	if('reply_to_message' in data) {
		const times = text.split(' ')
		.filter((t, idx) => (idx != 0 && t.match(/(\d+m|\d+h|\d+d)/gmi)))
		const until_date = times.length > 0 ? makeTime(times[0]) : 0;
		const params = {
			chat_id : data.chat.id,
			user_id : data.reply_to_message.from.id,
		};
		if(until_date){
			params.until_date = until_date;
		}
		if(revoke_messages)
		{
			params.revoke_messages = revoke_messages;
		}

		console.log("VANN :: PARAM :::   ", params);

		const res = await bot.tryBan(params);

		console.log('BANNED:::::::' , res);
		if(res && res.ok)
		{
			const messages = [
				'donee 👍👍',
				'alright 💯',
				'great job 🌟',
				'okeyy dokeyy 🥰',
			]
			await bot.reply_text_to(data, messages[Math.floor(messages.length * Math.random())]);
		}
		await bot.sendMessage(
			{chat_id : LOG_GROUP},

			'++++  BANNED ++++ \n\n'
			+ 'params : ' + JSON.stringify(params, null, 4)
			+ '\n\n'
			+ 'data : '+JSON.stringify(data, null, 4)
			+ '\n\n'
			+ 'res : '+JSON.stringify(res, null, 4)
		);

	} else {
		await bot.reply_text_to(data,'reply to a message or gimme username');
	}

}

async function unbanUser(data, only_if_banned = true) {
	console.log(JSON.stringify(data, null, 4));
	
	const can_ban = await bot.can_user_perform_action({user_id : data.from.id , chat_id : data.chat.id, permission : bot.PERMISSION.can_restrict_members});
	if(!can_ban)
	{
		return;
	}

	const {text} = data;
	const txt = text.split(' ').filter((_,i) => i != 0);
	const user_ids = [];
	for(let tok of txt)
	{
		if(tok.startsWith('@'))
		{
			user_ids.push(await getUserId(tok));
		}
	}

	if(user_ids.length != 0 )
	{

		const params = user_ids.map((uid,idx)=>{
			const p = {
				chat_id : data.chat.id,
				user_id: uid,
				only_if_banned,
			};
			return p;
		});

		const proms = [];
		for(let param of params)
		{
			proms.push(bot.unBanChatMember(param));
		}
		const res = await Promise.all(proms);

		if(res && res.ok)
		{
			const messages = [
				'donee 👍👍',
				'alright 💯',
				'great job 🌟',
				'okeyy dokeyy 🥰',
			]
			await bot.reply_text_to(data, messages[Math.floor(messages.length * Math.random())]);
		}
	

		await bot.sendMessage(
			{chat_id : LOG_GROUP},

			'++++  UNBANNED ++++ \n\n'
			+ 'params : ' + JSON.stringify(params, null, 4)
			+ '\n\n'
			+ 'data : '+JSON.stringify(data, null, 4)
			+ '\n\n'
			+ 'res : '+JSON.stringify(res, null, 4)
		);

		return;
	}





	if('reply_to_message' in data) {
		const params = {
			chat_id : data.chat.id,
			user_id : data.reply_to_message.from.id,
			only_if_banned,
		};
		

		console.log("UNBAN :: PARAM :::   ", params);

		const res = await bot.unBanChatMember(params);

		console.log('UNBANNED:::::::' , res);

		await bot.sendMessage(
			{chat_id : LOG_GROUP}, // SEND TO LOG GROUP
			'------  KICK / UNBAN ------- \n\n'
			+ 'params : '+JSON.stringify(params, null, 4)
			+ '\n\n'
			+ 'data : '+JSON.stringify(data, null, 4)
			+ '\n\n'
			+ 'res : '+JSON.stringify(res, null, 4)
		);

	} else {
		await bot.reply_text_to(data,'reply to the message or gimme username');
	}

}

async function muteUnmute(data, mute = true) {
	const {text} = data;
	
	const can_ban = await bot.can_user_perform_action({user_id : data.from.id , chat_id : data.chat.id, permission : bot.PERMISSION.can_restrict_members});
	if(!can_ban)
	{
		return;
	}

	const txt = text.split(' ').filter((_,i) => i != 0);
	const user_ids = [];
	for(let tok of txt)
	{
		if(tok.startsWith('@'))
		{
			user_ids.push(await getUserId(tok));
		}
	}

	if(user_ids.length != 0 )
	{

		const times = text.split(' ')
		.filter((t, idx) => (idx != 0 && t.match(/(\d+m|\d+h|\d+d)/gmi)))
		.map(time=>time.length > 0 ? makeTime(time[0]) : 0);

		const params = user_ids.map((uid,idx)=>{
			const p = {
				chat_id : data.chat.id,
				user_id: uid,
				can_send_messages : !mute,
			};
			
			if(idx < times.length)
			{
				p.until_date = times[idx];
			}

			return p;
		});

		const proms = [];
		for(let param of params)
		{
			proms.push(bot.setMessagePermission(param));
		}
		const res = await Promise.all(proms);

		if(res && res.ok)
		{
			const messages = [
				'donee 👍👍',
				'alright 💯',
				'great job 🌟',
				'okeyy dokeyy 🥰',
			]
			await bot.reply_text_to(data, messages[Math.floor(messages.length * Math.random())]);
		}
	

		await bot.sendMessage(
			{chat_id : LOG_GROUP},

			'++++  MUTE / UNMUTE ++++ \n\n'
			+ 'params : ' + JSON.stringify(params, null, 4)
			+ '\n\n'
			+ 'data : '+JSON.stringify(data, null, 4)
			+ '\n\n'
			+ 'res : '+JSON.stringify(res, null, 4)
		);

		return;
	}



	if('reply_to_message' in data) {
		const params = {
			chat_id : data.chat.id,
			user_id : data.reply_to_message.from.id,
			can_send_messages : !mute,
		};
		
		const times = text.split(' ')
		.filter((t, idx) => (idx != 0 && t.match(/(\d+m|\d+h|\d+d)/gmi)))
		const until_date = times.length > 0 ? makeTime(times[0]) : 0;

		if(mute && until_date)
		{
			params.until_date = until_date;
		}

		console.log("MUTE/UNMUTE :: PARAM :::   ", params);

		const res = await bot.setMessagePermission(params);

		console.log('MUTE / UNMUTE :::::::' , res);

		await bot.sendMessage(
			{chat_id : LOG_GROUP}, // SEND TO LOG GROUP
			'------  MUTE / UNMUTE ------- \n\n'
			+ 'params : '+JSON.stringify(params, null, 4)
			+ '\n\n'
			+ 'data : '+JSON.stringify(data, null, 4)
			+ '\n\n'
			+ 'res : '+JSON.stringify(res, null, 4)
		);

	} else {
		await bot.reply_text_to(data,'reply to the message or gimme username');
	}

}
