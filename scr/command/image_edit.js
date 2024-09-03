import { bot } from "..";

export function setup_image_edit_commands()
{    
    bot.on('/rmbg', removeBg_handler)
}








async function removeBg_handler(data)
{

	console.log('REMOVEEEEEEEEEEEEEEE BGGGGGGGGGGGGGGGGGGGGGG');
	if('reply_to_message' in data)
	{
		const {reply_to_message} = data;
		// photo
		if('photo' in reply_to_message)
		{
			const photo = reply_to_message.photo.pop();
			console.log('-----------------------',photo)
			const fileUrl = await bot.getFileUrl(photo.file_id);
			
			const res = await removeBG(fileUrl);

			console.log('REEEEEEEEESSSSSSSSSSSSSSSSSSSSSSSS',res);
			// console.log(await bot.sendPhoto(data, fileUrl));
		}
		// console.log(JSON.stringify(, null, 4));		
		return;
	}
	// TODO : implement
	const {text} = data;
}
