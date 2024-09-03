export async function getRiddle()
{
    const api_url = 'https://riddles-api.vercel.app/random';
    const res = await fetch(api_url).then(r => r.json());
    return res;
}



