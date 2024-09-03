import { bot } from "..";

export function setup_adminlist_commands()
{
    bot.on('/adminlist', adminlist);
    bot.on('/admins', adminlist);
}

async function adminlist (data){
	const adminlist = (await bot.getChatAdministrators(data)).result;
	
	let owner = null;
	let admins = [];
	adminlist.forEach(admin=>{
		console.log("ADMIN : ",admin);
		const {user} = admin;
		switch(admin.status)
		{
			case 'creator':
				owner = user;
			break;

			case 'administrator':
				admins.push(user);
		}
	});

	let text = "🛡 List of admins\n\n";
	text += `Our Sweet Owner @${owner.username ? owner.username : owner.first_name}\n\n\n\n`;

	text += 'And Our cute lil admins 🥰\n\n';
	admins.forEach(admin=>{
		text += `- @${admin.username ? admin.username : admin.first_name}\n`;
	})


	if('reply_to_message' in data)
	{
		await bot.reply_text_to(data.reply_to_message, text);
	} else {
		await bot.reply_text_to(data, text);
	}
}
