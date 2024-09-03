export async function getUserId(username)
{
    // const api = 'https://doraemon-tg-userbot.onrender.com/getUserid';
    const api = 'https://doraemon-userbot-ffa1.onrender.com/getUserid';
    const {userid} = await fetch(api,{
        method:'POST',
        headers:{
            'content-type':'application/json',
        },
        body:JSON.stringify({
            username,
        })
    }).then(r=>r.json());

    return userid;
}


