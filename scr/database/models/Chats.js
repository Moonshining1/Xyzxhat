import { supabase } from "../supabase";

export class Chats
{
    static #TABLE_NAME = "Chats";

    constructor()
    {
        throw Error("Shouldnt be initialized");
    }


    /**
     * @returns {Promise<boolean>}
     */
    static async getChatFromId(id)
    {
        const res = await supabase
            .from(this.#TABLE_NAME)
            .select("*")
            .eq('id', id);
        return res.data.length > 0 ? res.data[0] : null;
    }

    // use as less as possible
    static async countRows()
    {
        const res = await supabase
            .from(this.#TABLE_NAME)
            .select("*"); // maybe memory intensive?
            return res.data.length;
    }
        
    static async addChat({id, title, username, type})
    {
        const res = await supabase
        .from(this.#TABLE_NAME)
            .insert({id, title, username, type});
        return res;
    }

    static async getAllChats()
    {
        const {data} = await supabase
            .from(this.#TABLE_NAME)
            .select("id")
            .limit(10000);
        
        return data;
    }
}
