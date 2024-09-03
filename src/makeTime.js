const NUM_MS_IN_SECONDS = 1000;
const NUM_MS_IN_MIN = NUM_MS_IN_SECONDS * 60;
const NUM_MS_IN_HR  = NUM_MS_IN_MIN * 60;
const NUM_MS_IN_DAY = NUM_MS_IN_HR * 24;

export function makeTime(time)
{
    console.log('time', time);
	let timestamp = +(time.replace(/[\D]/gmi,'')) || 0;
    const suffix = time[(''+timestamp).length]?.toLowerCase() || 'm';
    switch(suffix)
    {
        case 'd':
            timestamp *= NUM_MS_IN_DAY;
        break;
        case 'h':
            timestamp *= NUM_MS_IN_HR;
        break;
        case 'm':
            timestamp *= NUM_MS_IN_MIN;
        break;
    }

    return Math.floor(((new Date()).getTime() + timestamp) / 1000);
}

// function print(t)
// {
//     const timestamp = makeTime(t);
//     const date = new Date(timestamp * 1000);
//     console.log(t ,`\t\t=>  ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}     ${date.getHours()} : ${date.getMinutes()}`)
// }

// print('2D')
// print('d')
// print('10s')
// print('1m')
// print('1d')
// print('10days')
// print('20h')
// print('30hours')
// print('40d')
// print('50days')

// // console.log(makeTime('2D'))
// // console.log(makeTime('d'))
// // console.log(makeTime('1d'))
// // console.log(makeTime('10days'))
// // console.log(makeTime('20h'))
// // console.log(makeTime('30hours'))
// // console.log(makeTime('40d'));
// // console.log(makeTime('50days'))
