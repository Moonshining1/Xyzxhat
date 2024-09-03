import { bot } from "..";
import { ask_ai } from "../ask_ai";

export function setup_poll_commands()
{        
    bot.on('/cheat', async (data) => {
        const res = await choose_poll(data);
        await sleep(4000); // sleep for 4 seconds
        console.log(res);
        const { chat, message_id } = res.result;
        const chat_id = chat.id;
        await bot.deleteMessage({ chat_id, message_id });

    })

    bot.on('/poll', async (data) => {
        const poll = createPollFromCommandString(data.text);
        await bot.sendPoll(data, poll);
    })

    bot.on('/choose', choose_poll);

    bot.on('/explain', async (data) => {
        if (!('reply_to_message' in data)) {
            return;
        }
        const reply_obj = data.reply_to_message;
        if (!('poll' in reply_obj)) {
            return await bot.reply_text_to(data, 'reply to a poll');
        }
        const is_mcq = reply_obj.allows_multiple_answers;
        const poll = reply_obj.poll;
        const question = poll.question;
        const options = poll.options.map((opt, idx) => `${idx + 1})  ${opt.text}`);

        const res = (await ask_ai(`
    Answer this ${is_mcq ? 'multiple choice question' : 'single correct question'}

    Question: ${question}


    Options :
        ${options.join('\n')}


    your response should contain text only from option
    just choose from options and explaination and try to give fun facts
    here's an example

    Question : who is father of computer

    Options:
        1) prashanth kumar
        2) charless babbage
        3) alan turing


    and response should be like

    Correct Option : 
        2) charless babbage

    Explaination:
        Charles Babbage is known as the father of the computer because he was the first to invent the Analytical Engine, which led to the invention of the modern-day computer. The Analytical Engine consisted of an Arithmetic Logic Unit or ALU, an integrated memory, and a basic flow control involving branching and loops.
        `));

        return await bot.reply_text_to(data, res);
    });

}





export function createPollFromCommandString(text) {
    const poll_data = text
        .split(" ").filter((_, i) => i != 0).join(" ") // remove /command
        .split('\n').map(p => p.trim()).filter(p => p.length); // split tokens

    const question = poll_data[0];
    const options = poll_data.filter((_, i) => i != 0).map(text=>({text}));

    return {question , options};
}




async function choose_poll(data) {
	if (!('reply_to_message' in data)) {
		return;
	}
	const reply_obj = data.reply_to_message;
	if (!('poll' in reply_obj)) {
		return await bot.reply_text_to(data, 'reply to a poll');
	}
	const is_mcq = reply_obj.allows_multiple_answers;
	const poll = reply_obj.poll;
	const question = poll.question;
	const options = poll.options.map((opt, idx) => `${idx + 1})  ${opt.text}`);

	const res = (await ask_ai(`
		Answer this ${is_mcq ? 'multiple choice question' : 'single correct question'} 

		Question: ${question}


		Options :
			${options.join('\n')}

		
		your response should contain text only from option
		just choose from options and dont write anything else
	`));

	return await bot.reply_text_to(data, res);
}
