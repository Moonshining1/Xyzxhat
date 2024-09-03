import { bot } from "..";

export function setup_joke_command()
{
    
    bot.on("/joke", async (data) => {
        const open_blacklist = [];
        console.log("data : ", data);
        const filters = data.text.split(" ");
        filters.splice(0, 1);
        const joke = await getJoke({ filters });
        await bot.reply_text_to_html_mode(data, joke);
    });
}


async function getJoke({ filters }) {
    const cats = ['programming', 'misc', 'dark', 'pun', 'spooky', 'christmas'];
    const blacklists = ['nsfw', 'religious', 'political', 'racist', 'sexist', 'explicit'];

    // allow filters to be used which is in filters
    const blacklists_filtered = filters.includes('any') ? [] : blacklists.filter(fltr => !filters.includes(fltr));
    // reverse process of blacklists_filtered here
    const include_cats = cats.filter(cat => filters.includes(cat));

    const url = `https://v2.jokeapi.dev/joke/${(include_cats.length > 0) ? include_cats.join(',') : 'Any'}?blacklistFlags=${blacklists_filtered.join(",")}`;
    const res = await fetch(url).then(res => res.json());

    console.log("JOKE : ", url);

    if (res.type == 'twopart') {
        const setup = res.setup;
        const delivery = res.delivery;
        return (`${setup}\n\n<span class="tg-spoiler">${delivery}</span>`);
    } else {
        return res.joke;
    }
}