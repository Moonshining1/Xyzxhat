import { bot } from "..";

export function set_truth_or_dare_commands()
{
    bot.on('/truth', async (data) => {
        let toks = data.text.split(' ');
        let rating = null;
        if(toks.length >= 2) rating = toks[1];
        
        const res = await truth_or_dare(false, rating);
        await bot.reply_text_to_html_mode(data, res);
    });

    bot.on('/dare', async (data) => {
        let toks = data.text.split(' ');
        let rating = null;
        if(toks.length >= 2) rating = toks[1];
        
        const res = await truth_or_dare(true, rating);
        await bot.reply_text_to_html_mode(data, "I Dare You to \n"+res);
    });
}


async function truth_or_dare(isDare = false, rating = null)
{
    const url = `https://api.truthordarebot.xyz/${isDare ? 'api/dare' : 'v1/truth'}${rating ? '?rating=' + rating : ''}`
    const { rating : rating_, question} = await fetch(url).then(r=>r.json());
    if(rating_ == 'r')
    {
        return `<span class="tg-spoiler">${question}</span>`;
    }
    return question;
}
