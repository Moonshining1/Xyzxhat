export function strip_commands(text){
    return text.split(' ').filter((_,i)=>i!=0).join(" ").trim();
}

export async function sleep(delay_time) {
	await new Promise((res, rej) => setTimeout(res, delay_time));
}

export async function mannual_delay(num_words, dt) {
	// mannual typing delay
	let wpm = 35;
	let delay_time = (num_words / wpm) * 60 * 100;
	delay_time -= dt;
	if (dt > 0) {
		// sleep 
		await sleep(delay_time);
	}
}
