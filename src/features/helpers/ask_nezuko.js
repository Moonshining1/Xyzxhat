import { ask_ai } from "../../ask_ai";
import { about_nezuko } from "../../info";

export async function ask_nezuko(data) {
	//----------------------------------------------------------
	const res = await ask_ai(
		` ${about_nezuko}
	
			Your Owner is "MR MOON" with id @Moonshining2 , 
			and co-Owner is "VIP Owner" with id  @Moonshining6 , 
			tell about me only if user asks.
			
			You have to reply user named "${data.from.first_name}" 
			continuing following conversation.
			
			\`\`\`
			${('reply_to_message' in data ?
			`${data.reply_to_message.from.first_name} : ${('text' in data.reply_to_message) ? data.reply_to_message.text : data.reply_to_message.caption}
				
				
				`
			: '')}
			${data.from.first_name} : ${('text' in data) ? data.text : data.caption}
			\`\`\`
			
			
			`
	);
	if (res == 'waat.') {
		return '';
	}
	// console.log(res);
	return res;

}
