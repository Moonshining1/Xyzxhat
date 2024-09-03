import { ask_ai } from "./ask_ai";

const reaction_list = [
    "airkiss",
    "angrystare",
    "bite",
    "bleh",
    "blush",
    "brofist",
    "celebrate",
    "cheers",
    "clap",
    "confused",
    "cool",
    "cry",
    "cuddle",
    "dance",
    "drool",
    "evillaugh",
    "facepalm",
    "handhold",
    "happy",
    "headbang",
    "hug",
    "kiss",
    "laugh",
    "lick",
    "love",
    "mad",
    "nervous",
    "no",
    "nom",
    "nosebleed",
    "nuzzle",
    "nyah",
    "pat",
    "peek",
    "pinch",
    "poke",
    "pout",
    "punch",
    "roll",
    "run",
    "sad",
    "scared",
    "shout",
    "shrug",
    "shy",
    "sigh",
    "sip",
    "slap",
    "sleep",
    "slowclap",
    "smack",
    "smile",
    "smug",
    "sneeze",
    "sorry",
    "stare",
    "stop",
    "surprised",
    "sweat",
    "thumbsup",
    "tickle",
    "tired",
    "wave",
    "wink",
    "woah",
    "yawn",
    "yay",
    "yes"
];

export async function getAgif(search_term) {
    const reaction = await ask_ai(`
You are working in a piece of code that
chooses a reaction from a reaction list
based on a phrase that matches that reaction's sentiment

Your response Should strictly be one of string from the below
reaction list based on Phrase

Phrase : ${search_term}

Reaction List = [${reaction_list.join(" ,")}]



You should return only a reaction from reaction list
returning anything else would cause code to break so keep in mind.

Here are some sample example to help you understand more

Example 1 :
    Phrase : Love you
    Output : airkiss

Example 2 :
    Phrase : lol
    Output : laugh

Example 2 :
    Phrase : okay
    Output : thumbsup

Example 3 : 
    Phrase : Do you wana fight with me ?
    Output : pounch

Example 4 :
    Phrase : Youre so cute
    Output : blush
`);

    if (!reaction_list.includes(reaction)) {
        return '';
    }
    let api_url = `https://api.otakugifs.xyz/gif?reaction=${reaction}`;
    let res = await fetch(api_url).then(r => r.json());
    if (!('url' in res)) {
        return '';
    }

    return res.url;
}