import json
import requests


class Bot:
    def __init__(self):
        self._bot_token = ""
        self._bot_owner_id = ""
        self._actions = {}

        self.PERMISSION = {
            'can_change_info': 'can_change_info',
            'can_manage_chat': 'can_manage_chat',
            'can_invite_users': 'can_invite_users',
            'can_pin_messages': 'can_pin_messages',
            'can_edit_stories': 'can_edit_stories',
            'can_post_stories': 'can_post_stories',
            'can_manage_topics': 'can_manage_topics',
            'can_post_messages': 'can_post_messages',
            'can_edit_messages': 'can_edit_messages',
            'can_delete_stories': 'can_delete_stories',
            'can_promote_members': 'can_promote_members',
            'can_delete_messages': 'can_delete_messages',
            'can_restrict_members': 'can_restrict_members',
            'can_manage_video_chats': 'can_manage_video_chats',
        }

        self.ACTION = {
            'TYPING': 'typing',
        }

    def config(self, bot_token, owner_id):
        self._bot_token = bot_token
        self._bot_owner_id = owner_id
        self.api_url = f'https://api.telegram.org/bot{bot_token}/'
        return self

    def get_bot_token(self):
        return self._bot_token

    def on(self, command, event):
        if command not in self._actions:
            self._actions[command] = []
        self._actions[command].append(event)

    def respond_to(self, data):
        if 'message' in data:
            return self._respond_to_message(data['message'])
        else:
            print('respond_to: unknown', data)

    def _respond_to_message(self, data):
        cmd_unsanitized = data.get('text', '').split(' ')[0]
        command = cmd_unsanitized.split('@')[0] if cmd_unsanitized else '${unimplemented}'
        actions = self._actions.get(command)

        if data['chat']['type'] == "private" and not actions:
            actions = self._actions.get('${private_message}')
        if not actions or not actions:
            actions = self._actions.get('${group_message}')
        if 'new_chat_members' in data:
            actions = self._actions.get('${group_join}')

        if actions:
            proms = [action(data) for action in actions if action]
            return all(proms)  # Wait for all actions

    async def try_ban(self, chat_id, user_id, until_date, revoke_messages=False):
        is_admin = await self.is_admin(chat_id, user_id)
        if is_admin:
            return None
        return await self.make_api_call(
            {
                'chat_id': chat_id,
                'user_id': user_id,
                'until_date': until_date,
                'revoke_messages': revoke_messages
            },
            'banChatMember'
        )

    async def reply_text_to(self, message_obj, reply_text):
        data = {
            'text': reply_text,
            'chat_id': message_obj['chat']['id'],
            'reply_to_message_id': message_obj['message_id'],
        }
        return await self.make_api_call(data, 'sendMessage')

    async def send_chat_action(self, message_obj, action):
        data = {
            'chat_id': message_obj['chat']['id'],
            'action': action,
        }
        return await self.make_api_call(data, 'sendChatAction')

    async def make_api_call(self, body, endpoint):
        response = requests.post(f"{self.api_url}{endpoint}", json=body)
        return response.json()

    async def is_admin(self, chat_id, user_id):
        user_info = await self.get_chat_member(user_id, chat_id)
        stat = user_info['result']['status']
        return stat in ['creator', 'administrator']

    async def get_chat_member(self, user_id, chat_id):
        return await self.make_api_call({'user_id': user_id, 'chat_id': chat_id}, 'getChatMember')

    # Add other methods similarly...

# Usage example
# bot = Bot().config('your_bot_token', 'your_owner_id')
# bot.on('command', your_event_function)
