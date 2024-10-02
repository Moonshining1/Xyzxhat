import { _impl_upload_input_file } from "./impl/_impl_upload_input_file";



class Bot {
    #bot_token = "";
    #bot_owner_id = "";
    #actions = {}

    constructor() { // TODO : Throw Exception
        this.#actions = {};

        this.PERMISSION = {
            can_change_info: 'can_change_info',
            can_manage_chat: 'can_manage_chat',
            can_invite_users: 'can_invite_users',
            can_pin_messages: 'can_pin_messages',
            can_edit_stories: 'can_edit_stories',
            can_post_stories: 'can_post_stories',
            can_manage_topics: 'can_manage_topics',
            can_post_messages: 'can_post_messages',
            can_edit_messages: 'can_edit_messages',
            can_delete_stories: 'can_delete_stories',
            can_promote_members: 'can_promote_members',
            can_delete_messages: 'can_delete_messages',
            can_restrict_members: 'can_restrict_members',
            can_manage_video_chats: 'can_manage_video_chats',
        }

        this.ACTION = {
            TYPING: 'typing',
        }
        Object.freeze(this.ACTION);
        Object.freeze(this.PERMISSION);
    }

    config({ bot_token, owner_id }) {
        this.#bot_token = bot_token;
        this.#bot_owner_id = owner_id;
        this.api_url = `https://api.telegram.org/bot${bot_token}/`;
        return this;
    }

    // async so that its consistent with rest of api
    async getBotToken()
    {
        return this.#bot_token;
    }

    on(command, event) {
        if (!this.#actions[command])
            this.#actions[command] = [];

        this.#actions[command].push(event);
    }

    async respond_to(data) {
        if (Object.keys(data).includes('message')) {
            return this.#respond_to_message(data.message);
        } else {
            console.log('resopond_to : unknown', data, Object.keys(data));
        }
    }

    async #respond_to_message(data) {
        const cmd_unsanitized = data?.text?.split(' ')[0];
        const command = cmd_unsanitized ? cmd_unsanitized.split('@')[0] : '${unimplemented}';
        let actions = this.#actions[command];


        if (data.chat.type == "private" && !actions) {
            actions = this.#actions['${private_message}'];
        }
        if (!actions || actions.length == 0) {
            actions = this.#actions['${group_message}'];
        }
        if ('new_chat_members' in data) {
            actions = this.#actions['${group_join}'];
        }


        if (actions && actions.length > 0) {
            const proms = [];

            actions.forEach((action) => {

                if (action)
                    proms.push(action(data));

            });

            await Promise.all(proms);
        } else {
        }

    }

    async tryBan({chat_id, user_id, until_date, revoke_messages = false})
    {
        const is_admin = await this.is_admin({chat_id, user_id});
        if(is_admin) return null;
        const res = await this.makeAPICall(
            {
                chat_id,
                user_id,
                until_date,
                revoke_messages
            },
            'banChatMember'
        );
        return res;
    }

    //----------------------- api methods -----------------

    async reply_text_to(message_obj, reply_text) {

        const data = {
            text: reply_text,
            chat_id: message_obj.chat.id,
            reply_to_message_id: message_obj.message_id,
        };

        const res = await this.makeAPICall(data, 'sendMessage');
        return res;
    }
    async sendChatAction(message_obj, { action }) {
        const data = {
            chat_id: message_obj.chat.id,
            action,
        };
        return await this.makeAPICall(data, 'sendChatAction');
    }
    async editMessageText(message_obj, new_text) {
        const data = {
            message_id: message_obj.message_id,
            chat_id: message_obj.chat.id,
            text: new_text,
        };
        return await this.makeAPICall(data, 'editMessageText');
    }
    async reply_text_to_html_mode(message_obj, reply_text) {

        const data = {
            text: reply_text,
            chat_id: message_obj.chat.id,
            reply_to_message_id: message_obj.message_id,
            parse_mode: 'HTML'
        };
        
        if('reply_to_message' in message_obj)
        {
            data.reply_to_message_id = message_obj.reply_to_message.message_id;
        }

        const res = await this.makeAPICall(data, 'sendMessage');
        return res;
    }

    async reply_text_to_md_mode(message_obj, reply_text) {

        const data = {
            text: reply_text,
            chat_id: message_obj.chat.id,
            reply_to_message_id: message_obj.message_id,
            parse_mode: 'MarkdownV2'
        };

        const res = await this.makeAPICall(data, 'sendMessage');
        return res;
    }

    async can_user_perform_action({ user_id, chat_id, permission }) {

        if (user_id == this.#bot_owner_id) return true;

        const user_info = await this.getChatMember({ user_id, chat_id });

        // if (user_info.result.user.username.toLowerCase() == this.#bot_owner_id.toLocaleLowerCase()) return true;

        if (user_info.result.status == 'creator') return true;

        if (user_info.result.status == 'administrator') {
            return user_info.result[permission];
        }

        return false;
    }

    async is_admin({ user_id, chat_id })
    {
        const user_info = await this.getChatMember({ user_id, chat_id });
        console.log('is_admin :::: ', user_info);
        const stat = user_info.result.status;
        return  stat == 'creator' || stat == 'administrator';
    }

    async sendMessage({chat_id}, text)
    {
        return await this.makeAPICall({chat_id, text}, 'sendMessage');
    }

    async unBanChatMember(params)
    {
        return await this.makeAPICall(params, 'unBanChatMember');
    }

    async setMessagePermission({chat_id, user_id, until_date, can_send_messages})
    {
        const params = {
            chat_id, 
            user_id, 
            use_independent_chat_permissions:true, 
            permissions:{
                can_send_messages : can_send_messages, 
            },
        };
        if(until_date) {
            params.until_date = until_date;
        }
        return await this.makeAPICall(params, 'restrictChatMember');
    }

    async reply_with_animation(message_obj, gif_url, gif_caption, reply_to_replyee = true) {

        const body = {
            chat_id: message_obj.chat.id,
            animation: gif_url,
            reply_to_message_id: message_obj.message_id,
        }
        // console.log(body);
        if (('reply_to_message' in message_obj) && reply_to_replyee) {
            body.reply_to_message_id = message_obj.reply_to_message.message_id;
        }

        if (gif_caption) {
            body.caption = gif_caption;
        }

        return await this.sendAnimation(body);
    }

    async upload_input_file({ file_id }) {
        return await _impl_upload_input_file.apply(this, ...arguments);
    }

    async sendPoll(data, poll) {
        const body = {
            chat_id: data.chat.id,
            question: poll.question,
            options: poll.options,

            type: 'regular', // see whats quizz mode
            is_anonymous: false,
        };

        const res = await this.makeAPICall(body, 'sendPoll');

        return res;
    }

    async sendMediaGroup(message_obj, media_arr) {
        const body = {
            chat_id: message_obj.chat.id,
            media: media_arr,
        }
        const res = await this.makeAPICall(body, 'sendMediaGroup');
        return res;
    }

    static makeInputMediaPhoto(media, caption, parse_mode = "HTML") {
        if(!caption){
            return {
                type: 'photo',
                media,
            };
        }

        return {
            type: 'photo',
            media,
            caption,
            parse_mode,
            caption_entities: [],
            show_caption_above_media: false,
            has_spoiler: false,
        };
    }

    //-----------------------------------------------------

    //----[ Webhook ]------------------------------

    async setWebhook(url, drop_pending_updates = false) {
        return await this.makeAPICall({url, drop_pending_updates}, 'SetWebhook');
    }

    async sendDocument({chat_id, document})
    {
        return await this.makeAPICall(arguments[0], 'sendDocument');
    }

    async getWebhookInfo() {
        return await this.makeAPICall(null, 'getWebhookInfo');
    }

    async deleteWebhook(delete_pending_updates = true) {
        return await this.makeAPICall(arguments[0], 'deleteWebhook');
    }

    async getChatMember({ user_id, chat_id }) {
        return await this.makeAPICall(arguments[0], 'getChatMember');
    }

    async getChat(chat_id) {
        return await this.makeAPICall(arguments[0], 'getChat');
    }

    async getFile({ file_id }) {
        return await this.makeAPICall(arguments[0], 'getFile');
    }

    async getFileBase64(file_id) {
        const file_obj = await this.getFile({ file_id });
        const { file_path } = file_obj.result;
        console.log("FILE_PATH : ", file_path);
        console.log("FILE_OBJ : ", file_obj);
        const file_url_final = `https://api.telegram.org/file/bot${this.#bot_token}/${file_path}`;
        const file = await fetch(file_url_final).then(r => r.body);
        const buff_array = (await file.getReader().read()).value;
        const base64_str = btoa(String.fromCodePoint(...buff_array));
        return base64_str;
    }

    async getFileUrl(file_id) {
        const file_obj = await this.getFile({ file_id });
        const { file_path } = file_obj.result;
        console.log("FILE_PATH : ", file_path);
        console.log("FILE_OBJ : ", file_obj);
        const file_url_final = `https://api.telegram.org/file/bot${this.#bot_token}/${file_path}`;
        return file_url_final;
    }
    async getChatAdministrators(data) {
        return await this.makeAPICall({chat_id : data.chat.id}, "getChatAdministrators");
    }
    async setMessageReaction(message_obj, emoji) {
        let message_id = message_obj.message_id;
        if ('reply_to_message' in message_obj) {
            message_id = message_obj.reply_to_message.message_id;
        }
        const args = {
            reaction: [
                {
                    emoji: emoji,
                    type: 'emoji',
                }
            ],
            chat_id: message_obj.chat.id,
            message_id
        };
        return await this.makeAPICall(args, "setMessageReaction");
    }

    async resolveFilePath({ file_path }) {
        return `https://api.telegram.org/file/bot${this.#bot_token}/${file_path}`;
    }

    async pinChatMessage({ chat_id, message_id }) {
        return await this.makeAPICall(arguments[0], 'pinChatMessage');
    }

    async sendAnimation(body) {
        return await this.makeAPICall(arguments[0], 'sendAnimation');
    }

    async deleteMessage({ chat_id, message_id }) {
        return await this.makeAPICall(arguments[0], 'deleteMessage');
    }
    async sendSticker({ chat_id, sticker, reply_to_message_id }) {
        return await this.makeAPICall(arguments[0], 'sendSticker');
    }

    async getStickerSet({ name }) {
        return await this.makeAPICall(arguments[0], 'getStickerSet');
    }

    async createNewStickerSet({ user_id, name, title, stickers }) {
        return await this.makeAPICall(arguments[0], 'createNewStickerSet');
    }

    async addStickerToSet({ user_id, name, sticker }) {
        return await this.makeAPICall(arguments[0], 'addStickerToSet');
    }

    async uploadStickerFile({ user_id, sticker }) {
        return await this.makeAPICall(arguments[0], 'uploadStickerFile');
    }



    async sendPhoto({ chat_id, photo, ...res }) {
        return await this.makeAPICall(arguments[0], 'sendPhoto');
    }
    //---------------------------------------------

    async makeAPICall(body, endpoint) {
        const res = await fetch(this.api_url + endpoint, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(res => res.json());

        return res;
    }

};



export default Bot;
