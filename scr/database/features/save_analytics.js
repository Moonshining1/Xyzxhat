import { Chats } from "../models/Chats";
import { Users } from "../models/Users";

// TODO : annotate data -> Message object
export async function save_analytics(data)
{
    const {chat} = data;
    const userData = {...data.from, last_seen_in_chat_id: chat.id};
    if(await Users.getUserFromId(userData.id)) {
        const res = await Users.updateData(userData);
        // console.log("UPDATE Last seen chat id : ", res);
    } else {
        const res = await Users.addUser(userData);
    }


    //---------------------
    {
        const res = await Chats.addChat(chat);
        // console.log(res);
    }

}
