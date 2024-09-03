export async function ask_gemini_vision(base64_data, prompt, tries = 0) {
    try {
        let json = { prompt, base64_data };
        let body = JSON.stringify(json);
        // console.log(json);
        const res = await fetch("https://gemini-proxy-hinata.onrender.com/vision", {
        // const res = await fetch("https://gemini-proxy-vision.onrender.com/vision", {
        // const res = await fetch("https://gemini-proxy-vision-new.onrender.com/vision", {
        // const res = await fetch("https://narrow-shark-88.deno.dev", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
        }).then(r => r.json());

        console.log("-------------- RES ------------------- ", res);
        return res;
    } catch (err) {
        console.log("ERROR :: [ask_gemini_vision()]", err);
        return 'Hmm... I didnt get it actually 🤦‍♀️';
    }
}
