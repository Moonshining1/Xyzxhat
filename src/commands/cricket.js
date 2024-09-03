import { bot } from "..";
import { getLiveScores } from "../getLiveScores";

export function setup_cricket_commands()
{
    
    bot.on('/cric', async (data) => {
        const scores = await getLiveScores();
        // console.log(scores);
        if (scores.length == 0) {
            await bot.reply_text_to(data, 'No Live Cricket Matches Running.');
        } else {
            let proms = [];
            for (let idx in scores) {
                proms.push(bot.reply_text_to(data, scores[idx]));
            }
            let res = await Promise.all(proms);
            console.log(res)
        }
    });

}