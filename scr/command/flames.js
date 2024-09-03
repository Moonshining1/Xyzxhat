import { bot } from "..";

export function setup_flames_command()
{
    bot.on("/flames", async (data) => {
        let names = data.text.substr(7).split(',');
        if (names.length >= 2) {
            let x = names[0].trim();
            let y = names[1].trim();
            let relationship = flames(x, y);
    
            if ('reply_to_message' in data) { // TODO : we mutate the data , do something else 
                data.message_id = data.reply_to_message.message_id;
            }
            await bot.reply_text_to_html_mode(data, `The relationship between\n${x}  and  ${y}  will end in\n\n       <span class="tg-spoiler">${relationship}!</span>`)
        } else {
            if (!('reply_to_message' in data)) {
                return;
            }
    
            let name1_obj = data.reply_to_message.from;
            let name2_obj = data.from;
            let name1 = name1_obj.first_name + ' ' + (name1_obj.second_name ? name1_obj.last_name : '');
            let name2 = name2_obj.first_name + ' ' + (name2_obj.second_name ? name2_obj.last_name : '');
            let relationship = flames(name1, name2);
    
            data.message_id = data.reply_to_message.message_id;
    
    
            await bot.reply_text_to_html_mode(data, `The relationship between\n${name1}  and  ${name2}  will end in\n\n       <span class="tg-spoiler">${relationship}!</span>`)
        }
    });
    
    
} 












function flames(name1, name2){
    name1 = name1.toLowerCase();
    name2 = name2.toLowerCase();

    let relations = ["Friendship", "Love", "Affection", "Marriage", "Enemy", "Siblings"];

    let common_letters = new Set();
    let map = {};
    // fill lookup map
    for(let ch of name1){
        map[ch] = true;
    }
    // put all common character in set
    // these characters are common characters
    for(let ch of name2){
        if(ch in map) common_letters.add(ch);
    }
    // count common character
    let count_common_chars = 0;
    for(let ch of name1){
        if(common_letters.has(ch)) count_common_chars++;
    } 
    for(let ch of name2){
        if(common_letters.has(ch)) count_common_chars++;
    }

    let index = (name1.length + name2.length - count_common_chars - 1 ) % relations.length;
 
    return relations[index];
}