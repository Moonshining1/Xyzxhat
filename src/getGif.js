export async function getGif(keyword) {
    // return await getGiphyGif(keyword);
    return await getTenorGif(keyword);

    // const api = 'https://api.giphy.com/v1/gifs/search';
    // const body = {
    //     api_key: 'gJ0S4qbE5arlmUlJDp1mfvjeXKdh74m2',
    //     q: 'hello',
    //     limit: 50,
    // };
}

async function getTenorGif(keyword) {
    const api_key = 'AIzaSyC9J8uSWW4LH3aUNk17LfWfhnLYw_HAcd0';
    const url = `https://tenor.googleapis.com/v2/search?q=${keyword}&key=${api_key}&client_key=nezuko-tg-bot&limit=15`;
    const res = await fetch(url).then(r=>r.json());
    const gifs = res.results.map(res=>(res.media_formats.gif.url));
    // const gifs = res.results.map(res=>(res.itemurl));
    return gifs[Math.floor(Math.random() * gifs.length)];
}


// console.log(await getTenorGif("Hello"));

async function getGiphGif(keyword) {
    const api_key = 'YxqfUD9VrqJiAsGc73Xe5tmiMPGmn6Gv';
    const api = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${keyword}&limit=50&offset=0`;
    const res = (
        await fetch(api).then(res => res.json())
    );
    
    return res.data[Math.floor(Math.random() * res.data.length)].images.original.url;
}