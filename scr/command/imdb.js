import { bot } from "..";
import Bot from "../bot";
import { imdb_make_caption, imdb_search } from "../imdb";

export function setup_imdb_commands() {

    bot.on('/imdb', async (data) => {
        const search_term = data.text.split(" ").filter((e, i) => i != 0).join(" ");
        const imdb_res = await imdb_search(search_term);
        const media_arr_arr = imdb_res.map(_$ => (
            [
                // First Image with caption
                Bot.makeInputMediaPhoto(_$.image, imdb_make_caption(_$)),
                // Remaining Images
                ...(_$.images.map(img_src => Bot.makeInputMediaPhoto(img_src))).filter((e, idx) => (idx <= 2))
            ]
        ))
        const proms = [];
        media_arr_arr.map(media_arr => {
            proms.push(
                bot.sendMediaGroup(data, media_arr)
            )

            console.log("media", media_arr);
        })

        const res = await Promise.all(proms);
        console.log(res[0]);
    })

}