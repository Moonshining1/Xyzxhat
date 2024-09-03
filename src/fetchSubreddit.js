export async function fetchSubreddit(subreddit) {
    const api = `https://meme-api.com/gimme/${subreddit}/50`;
    const res = await fetch(api).then(res => res.json());
    return res.memes.sort((m1, m2) => m1.ups < m2.ups)[0];
}
