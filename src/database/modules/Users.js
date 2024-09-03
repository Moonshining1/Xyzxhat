import { supabase } from "../supabase";

/**
 * @typedef {{
 * id : Number,
 * first_name : String, 
 * is_bot : Boolean, 
 * username : String, 
 * last_seen_in_chat_id : Number,
 * chats_ids : Number[],
 * first_name_history: String[],
 * usernames_history: String[],
 * is_afk: Boolean,
 * last_active_time : Number
 * }} User 
 */


export class Users
{
    static #TABLE_NAME = "Users";

    constructor()
    {
        throw Error("Shouldnt be initialized");
    }


    /**
     * @returns {Promise<boolean>}
     */
    static async getUserFromId(id)
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
            .select("id")
            .limit(10000); // maybe memory intensive?
        return res.data.length;
    }

    static async updateData({id ,first_name, is_bot, username, last_seen_in_chat_id})
    {
        // TODO : keep track of all previous names and usernames ?
        const { data } = await supabase
            .from(this.#TABLE_NAME)
            .select("*")
            .eq('id', id);
        if(data.length == 0) return;
        const prevData = {...data[0]}; //! this object will be updated and flushed to db

        prevData.first_name = first_name;
        prevData.username = username;
        prevData.last_seen_in_chat_id = last_seen_in_chat_id;
        prevData.last_active_time = Date.now(); // we only care about difference so..
        prevData.is_afk = false; // we only care about difference so..

        // console.log("Prev Data", prevData);
        // chats_ids
        if(prevData.chats_ids == null) prevData.chats_ids = [];
        if((prevData.chats_ids.indexOf(last_seen_in_chat_id) == -1)) {
            prevData.chats_ids.push(last_seen_in_chat_id);
        }

        // first_name_history
        if(prevData.first_name_history == null) prevData.first_name_history = [];
        if(prevData.first_name && prevData.first_name != 'NULL' && prevData.first_name_history.indexOf(prevData.first_name) == -1){
            prevData.first_name_history.push(prevData.first_name);
        }

        //  usernames_history
        if(prevData.usernames_history == null) prevData.usernames_history = [];
        if(prevData.username && prevData.username != 'NULL' && prevData.usernames_history.indexOf(prevData.username) == -1) {
            prevData.usernames_history.push(prevData.username);
        }

        // update all values
        const updatedRes = await supabase
            .from(this.#TABLE_NAME)
            .update({...prevData})
            .eq('id', id);
            
        return updatedRes;
    }

    static async addUser({id, first_name, is_bot, username, last_seen_in_chat_id})
    {
        const res = await supabase
            .from(this.#TABLE_NAME)
            .insert({id, first_name, is_bot, username, last_seen_in_chat_id});
        return res;
    }

    static async setBio({id, set_bio})
    {
        const {error, data} = await supabase.
            from(this.#TABLE_NAME)
            .update({set_bio})
            .eq('id', id);

        if(error) return false;
        return true;
    }
    
    static async getBio({id})
    {
        const {error, data} = await supabase.
            from(this.#TABLE_NAME)
            .select("set_bio")
            .eq('id', id);

        if(error) return error;
        return data[0];
    }

    /**
     * 
     * @param {{id : Number}} id user's id
     * @returns {Promise<User>}
     */

    static async getUser({id})
    {
        const { data } = await supabase
            .from(this.#TABLE_NAME)
            .select("*")
            .eq('id', id);
        if(data.length != 0)
        {
            return data[0];
        }
        return null;
    }
}
