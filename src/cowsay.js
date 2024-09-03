export function say(text, decor_callback)
{
    return make_textbox(text) + decor_callback();
}

/**
 * @param {String} text 
 */
function make_textbox(text)
{
    text = text.trim();
    if(text.length <= 38 && (text.indexOf('\n') == -1)) return `< ${text} >`;
    const lines = [''];
    let mx_len = 0;
    for(let ch of text)
    {
        if(lines[lines.length - 1].length <= 38 && ch != '\n')
        {
            lines[lines.length - 1] += ch;
            mx_len = Math.max(mx_len, lines[lines.length - 1].length);
        } else {
            lines.push(ch == '\n' ? '' : ch);
            mx_len = Math.max(mx_len, lines[lines.length - 1].length);
        }
    }
    const border = " " + ("".padEnd(mx_len + 2,"-")) + " ";

    const last_idx = lines.length - 1;
    const content = lines.map((line, idx)=>(
        (idx == 0 ? '/ ' : (idx == last_idx ? '\\ ' :"| ")) + line.padEnd(mx_len, ' ') + (idx == 0 ? ' \\' : (idx == last_idx ? ' /' : " |"))
    )).join('\n');

    return border + '\n' + content + "\n" + border;
}

export function cow(){
    return (
`
        \\   ^__^
         \\  (oo)\_______
            (__)\       )\\/\\
                ||----w |
                ||     ||
`
    );
}


export function banana(){
    return (
` 
              \\      .---. __
          ,    \\    /     \\   \\    ||||
         \\\\\\\\      |O___O |    | \\\\||||
         \\   //    | \\_/  |    |  \\   /
          '--/----/|     /     |   |-'
                 // //  /     -----'
                //  \\\\ /      /
               //  // /      /
              //  \\\\ /      /
             //  // /      /
            /|   ' /      /
            //\\___/      /
           //   ||\\     /
           \\\\_  || '---'
           /' /  \\\\_.-
          /  /    --| |
          '-'      |  |
                    '-'`
    )
}


export function calvin()
{
    return (
` 
 \\                   .,
   \\         .      .TR   d'
     \\      k,l    .R.b  .t .Je
       \\   .P q.   a|.b .f .Z%
           .b .h  .E\` # J: 2\`     .
      .,.a .E  ,L.M'  ?:b \`| ..J9!\`.,
       q,.h.M\`   \`..,   ..,""\` ..2"\`
       .M, J8\`   \`:       \`   3;
   .    Jk              ...,   \`^7"90c.
    j,  ,!     .7"'\`j,.|   .n.   ...
   j, 7'     .r\`     4:      L   \`...
  ..,m.      J\`    ..,|..    J\`  7TWi
  ..JJ,.:    %    oo      ,. ....,
    .,E      3     7\`g.M:    P  41
   JT7"'      O.   .J,;     \`\`  V"7N.
   G.           ""Q+  .Zu.,!\`      Z\`
   .9.. .         J&..J!       .  ,:
      7"9a                    JM"!
         .5J.     ..        ..F\`
            78a..   \`    ..2'
                J9Ksaw0"'
               .EJ?A...a.
               q...g...gi
              .m...qa..,y:
              .HQFNB&...mm
               ,Z|,m.a.,dp
            .,?f\` ,E?:"^7b
            \`A| . .F^^7'^4,
             .MMMMMMMMMMMQzna,
         ...f"A.JdT     J:    Jp,
          \`JNa..........A....af\`
               \`^^^^^'\`
`
    )
}


export function cheese(){
    return (
`
 \\
  \\   _____   _________
     /     \\_/         |
    |                 ||
    |                 ||
   |    ###\\  /###   | |
   |     0  \\/  0    | |
  /|                 | |
 / |        <        |\\ \\
| /|                 | | |
| |     \\_______/   |  | |
| |                 | / /
/||                 /|||
   ----------------|
        | |    | |
        ***    ***
       /___\\  /___\\
`
    );
}


export function daemon(){
    return (
`
   \\         ,        ,
    \\       /(        )\`
     \\      \\ \\___   / |
            /- _  \`-/  '
           (/\\/ \\ \\   /\\
           / /   | \`    \\
           O O   ) /    |
           \`-^--'\`<     '
          (_.)  _  )   /
           \`.___/\`    /
             \`-----' /
<----.     __ / __   \\
<----|====O)))==) \\) /====
<----'    \`--' \`.__,' \\
             |        |
              \\       /
        ______( (_  / \\______
      ,'  ,-----'   |        \\
      \`--{__________)        \\/
`
    )
}


export function dragon_and_cow(){
    return (
`
                       \\                    ^    /^
                        \\                  / \\  // \\
                         \\   |\\___/|      /   \\//  .\\
                          \\  /O  O  \\__  /    //  | \\ \\           *----*
                            /     /  \\/_/    //   |  \\  \\          \\   |
                            @___@\`    \\/_   //    |   \\   \\         \\/\\ \\
                           0/0/|       \\/_ //     |    \\    \\         \\  \\
                       0/0/0/0/|        \\///      |     \\     \\       |  |
                    0/0/0/0/0/_|_ /   (  //       |      \\     _\\     |  /
                 0/0/0/0/0/0/\`/,_ _ _/  ) ; -.    |    _ _\\.-~       /   /
                             ,-}        _      *-.|.-~-.           .~    ~
            \\     \\__/        \`/\\      /                 ~-. _ .-~      /
             \\____(oo)           *.   }            {                   /
             (    (--)          .----~-.\\        \\-\`                 .~
             //__\\\\  \\__ Ack!   ///.----..<        \\             _ -~
            //    \\\\               ///-._ _ _ _ _ _ _{^ - - - - ~
`
    );
}


export function elephant(){
    return (
`
 \\     /\\  ___  /\\
  \\   // \\/   \\/ \\\\
     ((    O O    ))
      \\\\ /     \\ //
       \\/  | |  \\/
        |  | |  |
        |  | |  |
        |   o   |
        | |   | |
        |m|   |m|
`
    )
}

export function ghost(){
    return (
`
          \\
           \\
            \\          __---__
                    _-       /--______
               __--( /     \\ )XXXXXXXXXXX\\v.
             .-XXX(   O   O  )XXXXXXXXXXXXXXX-
            /XXX(       U     )        XXXXXXX\\
          /XXXXX(              )--_  XXXXXXXXXXX\\
         /XXXXX/ (      O     )   XXXXXX   \\XXXXX\\
         XXXXX/   /            XXXXXX   \\__ \\XXXXX
         XXXXXX__/          XXXXXX         \\__---->
 ---___  XXX__/          XXXXXX      \\__         /
   \\-  --__/   ___/\\  XXXXXX            /  ___--/=
    \\-\\    ___/    XXXXXX              '--- XXXXXX
       \\-\\/XXX\\ XXXXXX                      /XXXXX
         \\XXXXXXXXX   \\                    /XXXXX/
          \\XXXXXX      >                 _/XXXXX/
            \\XXXXX--__/              __-- XXXX/
             -XXXXXXXX---------------  XXXXXX-
                \\XXXXXXXXXXXXXXXXXXXXXXXXXX/
                  ""VXXXXXXXXXXXXXXXXXXV""
`
    )
}

export function hello_kitty(){
    return (
`
  \\
   \\
      /\\_)o<
     |      \\
     | O . O|
      \\_____/
`
    )
}


export function kiss(){
    return (
`
     \\
      \\
             ,;;;;;;;,
            ;;;;;;;;;;;,
           ;;;;;'_____;'
           ;;;(/))))|((\\
           _;;((((((|))))
          / |_\\\\\\\\\\\\\\\\\\\\\\\\
     .--~(  \\ ~))))))))))))
    /     \\  \`\\-(((((((((((\\\\
    |    | \`\\   ) |\\       /|)
     |    |  \`. _/  \\_____/ |
      |    , \`\\~            /
       |    \\  \\           /
      | \`.   \`\\|          /
      |   ~-   \`\\        /
       \\____~._/~ -_,   (\\
        |-----|\\   \\    ';;
       |      | :;;;'     \\
      |  /    |            |
      |       |            |
`
    )
}

export function milk(){
    return (
`
 \\     ____________
  \\    |__________|
      /           /\\
     /           /  \\
    /___________/___/|
    |          |     |
    |  ==\\ /== |     |
    |   O   O  | \\ \\ |
    |     <    |  \\ \\|
   /|          |   \\ \\
  / |  \\_____/ |   / /
 / /|          |  / /|
/||\\|          | /||\\/
    -------------|
        | |    | |
       <__/    \\__>
`
    )
}


export function lion(){
    return (
`
    \\    ____
     \\  /    \\
        | ^__^ |
        | (oo) |______
        | (__) |      )\\/\\
        \\____/|----w |
              ||     ||

`
    )
}



export function moose(){
    return (
`
  \\
   \\   \\_\\_    _/_/
    \\      \\__/
           (oo)\\_______
           (__)\\       )\\/\\
               ||----w |
               ||     ||
`
    )
}

export function pony(){
    return (
`
     \\      _^^
      \\   _- oo\\
          \\----- \\______
                \\       )\\
                ||-----|| \\
                ||     ||
`
    )
}


export function ren(){
    return (
`
   \\
    \\
    ____
   /# /_\\_
  |  |/o\\o\\
  |  \\\\_/_/
 / |_   |
|  ||\\_ ~|
|  ||| \\/
|  |||_
 \\//  |
  ||  |
  ||_  \\
  \\_|  o|
  /\\___/
 /  ||||__
    (___)_)
`
    )
}



export function skele(){
    return (
`
  \\      (__)
   \\     /oo|
    \\   (_"_)*+++++++++*
           //I#\\\\\\\\\\\\\\\\I\\
           I[I|I|||||I I \`
           I\`I'///'' I I
           I I       I I
           ~ ~       ~ ~
`
    )
}

export function stimpy(){
    return (
`
  \\     .    _  .
   \\    |\\_|/__/|
       / / \\/ \\  \\
      /__|O||O|__ \\
     |/_ \\_/\\_/ _\\ |
     | | (____) | ||
     \\/\\___/\\__/  //
     (_/         ||
      |          ||
      |          ||\\
       \\        //_/
        \\______//
       __ || __||
      (____(____)
`
    )
}

export function pig(){
    return (
`
   \\         __,---.__
    \\   __,-'         \`-.
       /_ /_,'           \\&
       _,''               \\
      (")            .    |
        \`\`--|__|--..-'\`.__|


`
    )
}
export function duck(){
    return (
`
 \\
  \\
   \\ >()_
      (__)__ _
`
    )
}

export function tux(){
    return (
`
   \\
    \\
        .--.
       |o_o |
       |:_/ |
      //   \\ \\
     (|     | )
    /'\\_   _/\`\\
    \\___)=(___/
`
    )
}

