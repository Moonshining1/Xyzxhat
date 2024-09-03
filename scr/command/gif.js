import { bot } from "..";
import { getAgif } from "../agif";
import { getGif } from "../getGif";

export function setup_gif_commands()
{
    bot.on("/gif", async (data) => {
        // console.log("/gif", data);

        const search_term = data.text.split(" ");
        search_term.splice(0, 1);

        if (search_term.length < 1) {
            bot.reply_text_to(data, "use /gif <some_keword>");
            return;
        }
        try {

            const gif_url = (await getGif(search_term));
            console.log("gif url", gif_url);
            // for testing 
            // const gif_url = "https://media1.giphy.com/media/28GHfhGFWpFgsQB4wR/giphy.gif?cid=8ba4bc94vo88mi66mymdtbrfdu3rzov2rsdcosl77ljwcdby&ep=v1_gifs_search&rid=giphy.gif&ct=g";
            console.log("GIF Res : ", await bot.reply_with_animation(data, gif_url));
        } catch (err) {
            bot.reply_text_to(data, "gif limit exceeded");
        }

    })

    bot.on("/cgif", async (data) => {
        // console.log("/gif", data);

        const search_term = data.text.split(" ");
        search_term.splice(0, 1);

        if (search_term.length < 1) {
            bot.reply_text_to(data, "use /cgif <some_keword>");
            return;
        }
        try {

            const gif_url = (await getGif("cute cat "+search_term));
            console.log("gif url", gif_url);
            // for testing 
            // const gif_url = "https://media1.giphy.com/media/28GHfhGFWpFgsQB4wR/giphy.gif?cid=8ba4bc94vo88mi66mymdtbrfdu3rzov2rsdcosl77ljwcdby&ep=v1_gifs_search&rid=giphy.gif&ct=g";
            console.log("GIF Res : ", await bot.reply_with_animation(data, gif_url));
        } catch (err) {
            bot.reply_text_to(data, "gif limit exceeded");
        }

    })

    bot.on("/gift", async (data) => {
        // console.log("/gif", data);
        const search_term = data.text.substr(5).trim();

        if (search_term.length < 1) {
            bot.reply_text_to(data, "use /gift <some_keword>");
            return;
        }
        try {

            const gif_url = (await getGif(search_term));

            let caption = `@${data.from.username} sent ${search_term}`;
            if ('reply_to_message' in data) {
                caption = `@${data.from.username} sent ${search_term} to @${data.reply_to_message.from.username}`;
            }
            // console.log("gift url", gif_url);
            // for testing 
            // const gif_url = "https://media1.giphy.com/media/28GHfhGFWpFgsQB4wR/giphy.gif?cid=8ba4bc94vo88mi66mymdtbrfdu3rzov2rsdcosl77ljwcdby&ep=v1_gifs_search&rid=giphy.gif&ct=g";
            console.log("GIF Res : ", await bot.reply_with_animation(data, gif_url, caption));
        } catch (err) {
            console.log(err);
            bot.reply_text_to(data, "gift limit exceeded");
        }
    })

    bot.on("/dgift", async (data) => {
        console.log("/dgif", data);

        const search_term = data.text.split(" ");
        search_term.splice(0, 1);

        if (search_term.length < 1) {
            bot.bot.reply_text_to(data, "use /gif <some_keword>");
            return;
        }
        try {

            const gif_url = (await getGif(search_term));
            console.log("gif url", gif_url);
            // for testing 
            // const gif_url = "https://media1.giphy.com/media/28GHfhGFWpFgsQB4wR/giphy.gif?cid=8ba4bc94vo88mi66mymdtbrfdu3rzov2rsdcosl77ljwcdby&ep=v1_gifs_search&rid=giphy.gif&ct=g";
            console.log("GIF Res : ", await bot.reply_with_animation(data, gif_url, search_term));

            const chat_id = data.chat.id;
            const message_id = data.message_id;

            console.log("Delete : ", await bot.deleteMessage({ chat_id, message_id }));
        } catch (err) {
            console.log(err);
            bot.reply_text_to(data, "gif limit exceeded");
        }

    })


    
    bot.on('/agif', async (data) => {

        const search_term = data.text.split(" ");
        search_term.splice(0, 1);

        if (search_term.length < 1) {
            bot.reply_text_to(data, "use /gif <some_keword>");
            return;
        }

        try {
            const gif_url = await getAgif(search_term);
            console.log("gif url", gif_url);
            console.log("GIF Res : ", await bot.reply_with_animation(data, gif_url));
        } catch (err) {
            bot.reply_text_to(data, "gif limit exceeded");
        }
    });

}