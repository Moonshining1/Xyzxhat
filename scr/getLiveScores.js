// const url = "https://www.espncricinfo.com/live-cricket-score";
const base_url = "https://www.espncricinfo.com"; // used for getting resources / images
const live_score_url = "https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?lang=en&latest=true";

// console.log(await getLiveScores())

export async function getLiveScores() {

    const res = await fetch(live_score_url).then(r => r.json());
    const { matches } = res;
    // const upcomming = getScheduled(matches);
    const live = getLive(matches);
    const internationalLive = getInternational(live);
    console.log(JSON.stringify(internationalLive, null , 4));
    const  texts = convertMatchToTextArr(internationalLive)
    return texts;
};


function convertMatchToTextArr(matches) {
    return matches.map((match, idx)=>(
`
#${idx+1}
${match.series.longName}

${match.teams[0].team.longName} VS ${match.teams[1].team.longName}
in ${match.ground.name}

${match.statusText}


${
    match.teams[0].score ?
        `${match.teams[0].team.abbreviation} : ${match.teams[0].score}   (${match.teams[0].scoreInfo})`
    :
    ''
}

${
    match.teams[1].score ?
        `${match.teams[1].team.abbreviation} : ${match.teams[1].score}   (${match.teams[1].scoreInfo})`
    :
    ''
}

Batting Team ${
    (
        match.teams[0].inningNumbers.length > 0 
        && 
        match.teams[0].inningNumbers[0] === match.liveInning  
    ) ?
        match.teams[0].team.longName 
        :
        match.teams[1].team.longName 
}

------------------------------
${match.liveOvers} Overs Left
${match.liveBalls} Balls Left
${match?.liveInningPredictions?.winProbability ? `Win Probability : ${match?.liveInningPredictions?.winProbability}`  : '' }

${match.liveStreamUrl ? `Watch Live : ${match.liveStreamUrl}` : ''}

`
    ));
}

function getLive(matches) {
    return matches.filter(match=>(
        match["stage"] == "RUNNING" && match["state"] == "LIVE"
    ));
}

function getInternational(matches){
    return matches.filter(match=>(
        (match["internationalNumber"] != null)
    ));
}

function getScheduled(matches) {
    return matches.filter(match=>(
        match["stage"] == "SCHEDULED" && match["state"] == "PRE"
    ));
}


// console.log(await getLiveScores());