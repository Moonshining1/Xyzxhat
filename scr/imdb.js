// This part is 
// taken from https://github.com/tuhinpal/imdb-api/blob/master/src/helpers/getTitle.js

import DomParser from "dom-parser";



const api_base = "https://imdb-api.projects.thetuhin.com";

export async function imdb_search(text) {
    const { d: results } = await fetch(`https://v3.sg.media-imdb.com/suggestion/x/${text}.json?includeVideos=0`).then(r => r.json());

    const urls = results.map(res => (`https://www.imdb.com/title/${res.id}`));
    const proms = [];
    console.log(urls)
    for (let url of urls) {
        const id = url.split('/').reverse()[0];
        proms.push(fetch_imdb_title(url, id));
    }
    const res = await Promise.all(proms);
    return res.filter(res => res !== null);
}

// this function is taken from https://github.com/tuhinpal/imdb-api/blob/master/src/helpers/getTitle.js
async function fetch_imdb_title(url, id) {
    try {


        const html = await fetch(url).then(r => r.text());
        const parser = new DomParser();
        const dom = parser.parseFromString(html);
        const nextData = dom.getElementsByAttribute("id", "__NEXT_DATA__");
        const json = JSON.parse(nextData[0].textContent);
        const props = json.props.pageProps;

        return {
            id: id,
            imdb: `https://www.imdb.com/title/${id}`,
            contentType: props.aboveTheFoldData.titleType.id,
            contentRating: props.aboveTheFoldData?.certificate?.rating ?? "N/A",
            isSeries: props.aboveTheFoldData.titleType.isSeries,
            productionStatus:
                props.aboveTheFoldData.productionStatus.currentProductionStage.id,
            isReleased:
                props.aboveTheFoldData.productionStatus.currentProductionStage.id ===
                "released",
            title: props.aboveTheFoldData.titleText.text,
            image: props.aboveTheFoldData.primaryImage.url,
            images: props.mainColumnData.titleMainImages.edges
                .filter((e) => e.__typename === "ImageEdge")
                .map((e) => e.node.url),
            plot: props.aboveTheFoldData.plot.plotText.plainText,
            runtime:
                props.aboveTheFoldData.runtime?.displayableProperty?.value?.plainText ??
                "",
            runtimeSeconds: props.aboveTheFoldData.runtime?.seconds ?? 0,
            rating: {
                count: props.aboveTheFoldData.ratingsSummary?.voteCount ?? 0,
                star: props.aboveTheFoldData.ratingsSummary?.aggregateRating ?? 0,
            },
            award: {
                wins: props.mainColumnData.wins?.total ?? 0,
                nominations: props.mainColumnData.nominations?.total ?? 0,
            },
            genre: props.aboveTheFoldData.genres.genres.map((e) => e.id),
            // year: props.aboveTheFoldData.releaseDate.year,
            spokenLanguages: props.mainColumnData.spokenLanguages.spokenLanguages.map(
                (e) => ({
                    language: e.text,
                    id: e.id,
                })
            ),
        };
    } catch (err) {
        console.log(err);
        return null;
    }
}



/*
  {
    id: 'tt2771372',
    imdb: 'https://www.imdb.com/title/tt2771372',
    contentType: 'movie',
    contentRating: 'PG-13',
    isSeries: false,
    productionStatus: 'released',
    isReleased: true,
    title: 'Veronica Mars',
    image: 'https://m.media-amazon.com/images/M/MV5BMTQ4MDc0Mjg4OV5BMl5BanBnXkFtZTgwODk3NjYyMTE@._V1_.jpg',
    images: [
      'https://m.media-amazon.com/images/M/MV5BMTk2MzY1OTg2OV5BMl5BanBnXkFtZTgwODAxODEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTQyNDAyOTQ2MV5BMl5BanBnXkFtZTgwNTE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BODk5MDY4NTAzOV5BMl5BanBnXkFtZTgwNjE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjk2NjM3MzAyOV5BMl5BanBnXkFtZTgwNzE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTc1MDQ3Mjg4M15BMl5BanBnXkFtZTgwODE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BNTMzMDk0NzI1MV5BMl5BanBnXkFtZTgwOTE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BNjkxNzQ3MzYyNF5BMl5BanBnXkFtZTgwNzA2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjIzMDM2NDE1MF5BMl5BanBnXkFtZTgwODA2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjI4OTM0MzI1Nl5BMl5BanBnXkFtZTgwMTE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BNTQzOTIzNTMzMl5BMl5BanBnXkFtZTgwMzE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BNTgyNDM3Mjk0M15BMl5BanBnXkFtZTgwNDE2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTQ4MzMwMzQwMV5BMl5BanBnXkFtZTgwMzA2NDEzMTE@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTA2MTEwNDQ3MzJeQTJeQWpwZ15BbWU4MDQwNjQxMzEx._V1_.jpg'
    ],
    plot: "Years after walking away from her past as a young private eye, Veronica Mars gets pulled back to her hometown, just in time for her high school reunion, in order to help her old flame Logan Echolls, who's embroiled in a murder mystery.",
    runtime: '1h 47m',
    runtimeSeconds: 6420,
    rating: { count: 54758, star: 6.7 },
    award: { wins: 0, nominations: 6 },
    genre: [ 'Crime', 'Drama', 'Mystery', 'Thriller' ],
    spokenLanguages: [ [Object] ]
  }
*/

// console.log((await imdb_search('veronica')).map(d=>imdb_make_caption(d)));

export function imdb_make_caption(imdb_data) {
    const data = imdb_data;
    return (
        `
${data.title}
-------------------------------
[${data.contentRating} rated ${data.contentType}]  ⏲ (${data.runtime})

Rating : ${data.rating.star} / 10.0  ⭐ (${data.rating.count})



${data.plot}


-------------------------------

🔊 : ${data.spokenLanguages.map(l => l.language).join(" / ")}

${data.genre.map(g => '#' + g).join("  ")}

`
    );
}