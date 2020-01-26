import logging

from django.utils import timezone
from django.conf import settings

from common.mixins import SerializedView
from chat.models import Room, Message, Participant
from chat.utils import build_content


logger = logging.getLogger('chat.helpers')

OPPOSITES_FIELDS = ('id', 'username')

MESSAGE_FIELDS = (
    'id', 'created_at', 'content', 'author_id', 'author__preview_url:a_preview',
    'author__username:username', 'extra',
)

ROOM_FIELDS = (
    'id', 'created_at', 'last_message_at', 'last_message', 'first_message_id', 'opposites',
    'messages_unread', 'ticket__id:ticket', 'contact__id:contact',
)


def build_messages(room, last_id=0, first_id=0):
    messages = room.messages.select_related('author').all()
    if first_id:
        messages = messages.filter(pk__lt=first_id)
    elif last_id:
        messages = messages.filter(pk__gt=last_id)
    messages = list(messages.order_by('-created_at')[:settings.MESSAGE_FETCH_POOL_SIZE])
    messages.reverse()
    return SerializedView.serialize_items(messages, MESSAGE_FIELDS)


def get_chat_room(user_id, filter_data):
    room_id = filter_data.get('id', None)
    messages_last_id = int(filter_data.get('messages_last_id') or 0)
    messages_first_id = int(filter_data.get('messages_first_id') or 0)
    messages = []
    if room_id:
        try:
            room = Room.objects.get(users__in=[user_id], pk=room_id)
        except Room.DoesNotExist:
            room = None
    else:
        room = Room.objects.filter(users__in=[user_id]).order_by('last_message_at').last()
    if room:
        room.opposites = SerializedView.serialize_items(room.get_opposites(user_id), OPPOSITES_FIELDS)
        room.messages_unread = room.get_messages_unread(user_id).count()
        messages = build_messages(room, messages_last_id, messages_first_id)
        room = SerializedView.serialize_item(room, ROOM_FIELDS)
    return {
        'room': room,
        'messages': messages
    }


def add_message(user_id, data):
    room = Room.objects.get(users__in=[user_id], pk=data['id'])
    content = data.get('message').strip()
    if not content:
        return {'state': False, 'messages': ['Message is empty']}
    content = build_content(content)
    last_message = room.messages.filter(author_id=user_id).last()
    if last_message:
        if last_message.content == content:
            return {'state': False, 'messages': ['Duplicate message']}
    msg = Message.objects.create(
        room=room,
        content=content,
        author_id=user_id
    )
    read_messages(user_id, data)
    # room.unread_sync()
    if not room.first_message_id:
        room.first_message_id = room.messages.first().id
    room.last_message = content
    room.last_message_at = msg.created_at
    room.save()
    message = SerializedView.serialize_item(msg, MESSAGE_FIELDS)
    data = {
        'room_id': room.pk,
        'is_typing': False,
        'message': message,
    }
    notifications = [{
        'recipients': room.get_opposites(user_id),
        'data': data
    }]
    return data, notifications


def read_messages(user_id, data):
    participant = Participant.objects.filter(user_id=user_id, room_id=data['id']).first()
    if not participant:
        return {"status": False}
    last_ts = int(data.get('last') or 0)
    participant.visited_at = data.get('last_message_time') or timezone.now()
    participant.save()
    return {'status': True, 'unreaded': participant.room.get_messages_unread(participant.user).count(), 'room_id': participant.room_id, 'last_ts': last_ts}


def create_first_message(user_id, data):
    interlocutor_id = data.get('interlocutor_id')
    data = {
        'users': list(filter(lambda x: x, {user_id, interlocutor_id})),
    }
    assert len(data['users']) > 1, 'The first step to schizophrenia'
    room, new_room = Room.objects.get_or_create_room(**data)
    notifications = [{
        'recipients': room.get_opposites(user_id),
        'data': {
            'refetch': True,
            'room_id': room.pk
        }
    }]
    return {'room_id': room.pk}, notifications


def get_rooms(user_id, filter_data):
    """List of agents rooms into Sidebar
    @param user_id - request user id
    """
    rooms = Room.objects.filter(users__in=[user_id]).order_by('-last_message_at')
    items = []
    for room in rooms:
        room.opposites = SerializedView.serialize_items(room.get_opposites(user_id), OPPOSITES_FIELDS)
        room.messages_unread = room.get_messages_unread(user_id).count()
        items += [SerializedView.serialize_item(room, ROOM_FIELDS)]
    return {"rooms": items}
