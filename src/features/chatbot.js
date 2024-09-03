import { bot } from "..";
import { ask_ai } from "../ask_ai";
import { botname, botusername } from "../info";
import { mannual_delay } from "../utils";
import { ask_gemini_vision } from "./helpers/ask_gemini_vision";
import { ask_nezuko } from "./helpers/ask_nezuko";

export function enable_chatbot_features()
{


	bot.on('${group_join}', async (data) => {
		// ----------------------------------
		// const group_id = data.chat.id;
		const group_name = data.chat.title;
		// const group_photo_file_id = (await bot.getChat(group_id)).result.photo.big_file_id;
		// const
		const joined_members = data.new_chat_members;
		// console.log('joined members : ', joined_members);
		// return;
	
		if (joined_members.length == 1 && joined_members[0].is_bot) {
			console.log('bot')
			return;
			// return await bot.reply_text_to(data, 'seems like nice bot?');
		} else if (joined_members.length > 1) {
			await bot.sendChatAction(data,{action : bot.ACTION.TYPING});
			await new Promise((res,rej)=>setTimeout(res, 10000)); // send after 10 seconds
			return await bot.reply_text_to(data, 'Heya everyone welcome to our sweet gc!');
		}
	
		await bot.sendChatAction(data,{action : bot.ACTION.TYPING});
		await new Promise((res,rej)=>setTimeout(res, 10000)); // send after 10 seconds
	
		// const member_id = joined_members[0].id;
		const member_username = joined_members[0].username;
		const member_name = joined_members[0].first_name;
	
		const caption = await ask_ai(
			`You're ${botname} a cute soo sweet and flirty girl.
	you dont have to say that your a cute flirty girl
	but act like that.
	You need talk humanly in human's style with very sweet and soft tone 
	you need to greet a user your messages must be very short greeting not more than 2 lines
	and you can make typos and be crazy
	never ever say that youre a bot
	you want greet users on telegram by a welcome message
	
	
	the member name is  "${member_name}"
	group name is "${group_name}"
	
	${member_username ? 'You can mention user by using @' + member_username + ' ' : ''}
	
	you should mention his name in middle of message.
	and dont have to use quotes "".
	`);
	
		console.log(await bot.reply_text_to(data, caption));
	});
	

	bot.on('${private_message}', async (data) => {

		await bot.sendChatAction(data, { action: bot.ACTION.TYPING });
	
		const res = await ask_nezuko(data);
	
		await bot.reply_text_to(data, res);
	});
	
	

    bot.on('${group_message}', async (data) => {
        if (await should_trigger(data)) {
            let time_then = performance.now();
            await bot.sendChatAction(data, { action: bot.ACTION.TYPING });
    
            if (
                ('photo' in data)
                || ('sticker' in data)
                || (
                    ('reply_to_message' in data) &&
                    (
                        ('photo' in data.reply_to_message)
                        || ('sticker' in data.reply_to_message)
                    )
                )
            ) {
                await handle_vision(data);
            } else {
				console.log("NEZZYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
                const res = await ask_nezuko(data);
                console.log('--------------gc-------------------', data);
                console.log('reply : ', res);
    
                await mannual_delay(res.split(' ').length, performance.now() - time_then);
    
                if (!(await try_send_agif(data, res))) {
                    await bot.reply_text_to(data, res);
                }
    
            }
        } else {
            console.log('ignoring : ', data.text);
        }
    });
    
}


























async function should_trigger(data) {

	if ('reply_to_message' in data && data.reply_to_message.from.username == botusername) {
		return true;
	}

	const { text } = data;
	const pingged_me = text.match(/(hinata|hitana)/gmi);
	if (pingged_me) {
		return true;
	}
	
	if(data.from.id == '5539603796' && text.match(/(nezzy)/gmi))
	{
		return true;
	}

	// if its channel then we shouldnt reply
	if ('sender_chat' in data) {
		return false;
	}


	// if user replied bot then we shoul respond
	if ('reply_to_message' in data) {
		// TODO : check if its bot's userid
		return data.reply_to_message.from.username == botusername;
	}


	if ((Math.random() >= 0.04)) { // 4% probability
		return false;
	}

	const res = await ask_ai(
		`you are a fun telegram chat bot and should trigger on 
only on some messages that you think i intereting to answer and talk with.
you should ignore any bot commands
like
/tree
/gban
!ping
etc...
and also ignore ambigous messages that is not interesting or 
if a user is talking to someone else.

you should reply to only messages that are independent like.
and seem like its applicable to all members
"hello" -> since hello could be to anyone
"is anybody there" -> since this applies to anyone
"koi hai kya" -> anyone can reply this
"arey koi hai group me ? -> anyone can reply this"
"its too boring" -> anyone can reply this
"meh boring life" -> anyone can reply this
"i am going" -> anyone can reply this
"bye" -> anyone can reply this

etc...

and you shouldn't reply to messages like these.
which are likely to be in continuation with other messages.
and seem incomplete. and seem like they're talking to someone else.

"okay then?" -> seems like its for any other member
"so what did you eat today." -> might be asking to someone else
"oh yeah it was really fun" -> its clear that user is talking to someone else
"ye baat kya" -> seems like talking to someone else
"ok so tell me more" -> seems like talking to someone else
"aha" -> definitely talking to someone else
"hmm" -> definitely talking to someone else

etc...."


also your name is nezoku so you can reply to message if they call your name.

you respone should be either yes or no nothing else.
a you are being used as a function which would be fed in other function based on your yes/no reply.


so this is user text. respond with yes if you want to reply him or no if you dont

user text : ${text}`);

	const should_reply = res.toLowerCase() == 'yes';

	return should_reply;
}









async function try_send_agif(data, context) {
	if (Math.random() >= 0.1) return false;
	// < 10% chance to send gif
	let gif_url = await getAgif(context);
	if (!gif_url) return false;
	const res = await bot.reply_with_animation(data, gif_url, context, false);
	console.log(res);

	return true;
}





async function handle_vision(data) {
	if(
		('text' in data) 
		&& ('reply_to_message' in data) 
	) {	// user is asking something about image

		// TODO : handle case if nezuko sends an image and user asks some question on it
		//! Like /wall
		if ('photo' in data.reply_to_message) {
			const photo = data.reply_to_message.photo[0];
			const photo_base64 = await bot.getFileBase64(photo.file_id);
			const vision_response = await ask_gemini_vision(photo_base64,data.text.replace('hinata', ''));
			await bot.reply_text_to(data, vision_response);
		}

		if ('sticker' in data.reply_to_message) {
			const photo = data.reply_to_message.sticker.thumb;
			const photo_base64 = await bot.getFileBase64(photo.file_id);
			console.log("STKR : ", data.reply_to_message.sticker)
			console.log("IMG : ", photo, photo_base64)
			const vision_response = await ask_gemini_vision(photo_base64,data.text.replace('hinata', ''));
			await bot.reply_text_to(data, vision_response);
		}

	} else if('photo' in data) {
		const photo = data.photo[0];
		const photo_base64 = await bot.getFileBase64(photo.file_id);
		const vision_response = await ask_gemini_vision(photo_base64,
			`${about_nezuko}
			

"${data.from.first_name}" sent you this photo
respond something as ${botname} infering from this image which may contain text or meme or an reaction

${(('reply_to_message' in data) && ('text' in data.reply_to_message)) ?
	'your previous conversation is this : \n'
	+ data.from.first_name + ' : ' + data.from.text
	: ''
}
`
		);
		await bot.reply_text_to(data, vision_response);
	
	} else if('sticker' in data) {
		const photo = data.sticker.thumb;
		const photo_base64 = await bot.getFileBase64(photo.file_id);
		const vision_response = await ask_gemini_vision(photo_base64,
			`${about_nezuko}
			

"${data.from.first_name}" sent you this sticker
respond something as ${botname} infering from this sticker which maybe their reaction on previous message and  may contain text or meme

${(('reply_to_message' in data) && ('text' in data.reply_to_message)) ?
	'your previous conversation is this : \n'
	+ data.from.first_name + ' : ' + data.from.text
	: ''
}
`
		);

		if(vision_response != "Unable to recogonize image")
		{
			await bot.reply_text_to(data, vision_response);
		} else {
			const emojis = ['😊', '🥰', '😄', '😸', '🐱', '😚', '🌝🌝'];
			const idx = Math.floor(Math.randon() * emojis.length);
			await bot.reply_text_to(data, emojis[idx]);
		}
		
	} else {
		const emojis = ['😊', '🥰', '😄', '😸', '🐱', '😚', '🌝🌝'];
		const idx = Math.floor(Math.randon() * emojis.length);
		await bot.reply_text_to(data, emojis[idx]);
	}







	return;

	///-----------------------------
	let photo = null;
	let is_image_in_replied_message = false;
	if ('photo' in data) {
		photo = data.photo[0];
	}
	if ('sticker' in data) {
		photo = data.sticker.thumb;
	}
	if (!photo) { // image is in replied message
		is_image_in_replied_message = true;
		if ('photo' in data.reply_to_message) photo = data.reply_to_message.photo[0];
		if ('sticker' in data.reply_to_message) {
			photo = data.reply_to_message.sticker.thumb;
		}

	}


	/*
	
	
			prompt = `${about_nezuko}	
	
	
	
			${data.from.first_name} said """${data.text}""" about this image
			
			and ${data.reply_to_message.from.first_name} sent you an image.
	
		here is description of image from gemini vision model
	
		IMAGE Description : ${vision_response}
	
	
		you should reply something to ${data.from.first_name} as nezuko
		`
	
	*/

	if (!photo) {
		return;
	}

	const photo_base64 = await bot.getFileBase64(photo.file_id);
	const vision_response = await ask_gemini_vision(photo_base64,
		('sticker' in data) ? 'what you see in this? describe in detail like emotions objects etc.':
		(
			data.text ?
			data.text.replace('hinata', '')
			: 'what you see in this? describe in detail like emotions objects etc.'
		)
	);

	console.log("VISION :::::: ", vision_response);

	let prompt = null;

	if ('text' in data) {
		prompt = `${about_nezuko}


	${data.from.first_name} said """${data.text}""" to you

	on an image sent by ${data.reply_to_message.from.first_name}
	
	here is description of image from gemini pro vision model
	IMAGE Description : ${vision_response}

	
	
	you should reply something to ${data.from.first_name} as hinata
	`;
	} else {
		prompt = `${about_nezuko}
	you said """${data.reply_to_message.text}""" in your previous conversation
	and so ${data.from.first_name} sent you an ${'sticker' in data ? 'sticker' : 'image'}
	which represents their reaction on your conversation.
	
	here is description of image from gemini pro vision model
	IMAGE Description : ${vision_response}

	
	
	you should reply something to ${data.from.first_name} as hinnata
	remember that image is just a description of how they feel like on your previous conversation.
	`;
	}


	//---------------------------------------------
	// const nezuko_res = await ask_ai(prompt);
	const nezuko_res = vision_response == "Unable to recogonize image" ? await ask_ai(prompt) : vision_response;
	//---------------------------------------------
	await bot.reply_text_to(data, nezuko_res);
	// await bot.reply_text_to(data, vision_response);
}
