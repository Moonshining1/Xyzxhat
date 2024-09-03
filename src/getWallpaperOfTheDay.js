
export async function getWallpaperOfTheDay(n = 1){
    const baseurl = "https://bing.com";
    const api_url = `${baseurl}/HPImageArchive.aspx?format=js&idx=0&n=${n}&mkt=en-US`;
    const r = await fetch(api_url,{
        headers:{
            'content-type':'application/json'
        },
    });
    const txt = await r.text();
    const res = JSON.parse(txt);
    const {url, copyright} = res.images.pop();
    return {url : `${baseurl}/${url}`, copyright : copyright+'...'};


    // OLD 
    ////https://www.bing.com/th?id=OHR.FlorenceDuomo_ZH-CN7379412586_1920x1080.jpg
    ////https://www.bing.com/th?id=OHR.CardinalfishAnemone_EN-US1278259894_1920x1080.jpg
    // const {url, copyright} = await fetch("https://bing.biturl.top/").then(r=>r.json());
    // return {url, copyright};
}


// console.log(await getWallpaperOfTheDay(2));