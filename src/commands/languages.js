import { bot } from "..";
import { ask_ai } from "../ask_ai";

export function setup_languages_commands()
{
    bot.on("/tr", async (data) => {

        const language = data.text.substr(3);
        let text = 'reply_to_message' in data ?
            data.reply_to_message.text :
            data.text
                .substr(3)
                .split(' ')
                .filter((el, idx) => idx >= 1)
                .join(' ');
    
        const translation = await ask_ai(`Translate these sentences
            TranslateTo : ${language}
    
            Text : ${text}
    
    
            
    
    
    
            just give me the translation of Text of TranslateTo like this format in example.
    
            example 1:
                TranslateTo : en
                Text : हैलो सुप्रभात
    
                Output :
                    Translated from hindi to english.
    
                    hello good morning.
    
            example 2:
                TranslateTo : fr
                Text : आप कैसे हैं
    
                Output :
                    Translated from hindi to french.
                    
                    Comment vas-tu.
                
            example 3:
                TranslateTo : hindi
                Text : je suis un bon garçon
    
                Output :
                    Translated from french to hindi.
    
                    मेँ एक अच्छा लडका हूँ.
        `);
    
    
        await bot.reply_text_to(data, translation);
    });
    
    
    
    bot.on("/li", async (data) => {
    
        let text = 'reply_to_message' in data ?
            data.reply_to_message.text :
            data.text
                .substr(3)
                .split(' ')
                .filter((el, idx) => idx >= 1)
                .join(' ');
    
        const translation = await ask_ai(`
    What language does this Text belong to ?
    
    Text : ${text}
    
    
    
    Here are some examples 
    
    Example 1 :
    Text : मेँ एक अच्छा लडका हूँ
    Output :
        hindi
        
    Example 2 :
    Text : qui es-tu
    Output :
        french
    
    Example 3 :
    Text : Здравствуй, мальчик
    Output :
        russian
    
    
    
    
    Just write the name of language and nothing else.
            `);
    
    
        await bot.reply_text_to(data, translation);
    });
    
}