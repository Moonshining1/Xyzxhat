import { bot } from "..";
import { getWallpaperOfTheDay } from "../getWallpaperOfTheDay";

export function setup_wall_commands()
{
    bot.on('/wall',async (data)=>{
        let tok = data.text.split(' ');
        let n = 1;
        if(tok.length > 1) {
            n = +tok[1];
    	}
        const {url, copyright} = await getWallpaperOfTheDay(n);
        await bot.sendPhoto({chat_id : data.chat.id, photo: url, caption: copyright});
    })
}
