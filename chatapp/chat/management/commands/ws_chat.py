import os
import sys
import json
import asyncio
import logging
import traceback
import websockets

from django.conf import settings
from django.contrib.sessions.models import Session
from django.core.management.base import BaseCommand
from django.utils import translation, timezone

from common.mixins import DjangoJSONEncoder
from chat.models import Room
from chat.helpers import get_chat_room, add_message, read_messages, create_first_message, get_rooms


def j(data):
    return DjangoJSONEncoder().encode(data)


logger = logging.getLogger(__name__)
SUBSCRIBERS = {}
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"


class Command(BaseCommand):
    """
        ws actions:
            ping <- pong
            reconnect <- reconnect
            fetch <- get room by room_id. also can have messages_last_id of last message in room
            get_rooms <- returns rooms
            add_message <- adds message
            user_typing <- set typing for all other users in room
            read_messages <- reeds all messages till now for user
            create_first_message <- creates room
    """

    help = 'WS Chat'

    def add_arguments(self, parser):
        parser.add_argument('--host', type=str, default='127.0.0.1')
        parser.add_argument('--port', type=int, default=8889)

    def handle(self, host, port, *args, **options):
        async def wshandle(websocket, path):
            while True:
                sessions = sum(map(len, SUBSCRIBERS.values()))
                print('ws_chat iteration %s: %d sessions of %d subscribers' % (timezone.now(), sessions, len(SUBSCRIBERS)))
                request = await websocket.recv()
                request = json.loads(request)
                if request['command'] == 'ping':
                    await websocket.send(j({'command': 'pong'}))
                elif request['command'] == 'reconnect':
                    await websocket.send(j({'command': 'reconnect'}))
                session_key = request.pop('sessionid', None)
                try:
                    session = Session.objects.get(session_key=session_key)
                    user_id = int(session.get_decoded()['_auth_user_id'])
                    # register last request for subscriber
                    SUBSCRIBERS.setdefault(user_id, {})
                    SUBSCRIBERS[user_id][session.session_key] = websocket  # support several devices
                    response, notifications = chat_tick(user_id, request)
                except Session.DoesNotExist:
                    logger.info('Unknown sessionid "%s"' % session_key)
                    await websocket.send(j({'error': 'Unknown sessionid'}))
                except Exception as e:
                    logger.info('Request data: %s (session "%s")' % (request, session_key))
                    logger.exception(e)
                    await websocket.send(j({'error': 'Unknown error'}))
                    traceback.print_exception(*sys.exc_info())
                    raise e  # NOT WORK, wshandle handle exceptions
                    # Supervisor please restart me:
                    # sys.exit()
                else:
                    for notify in notifications:
                        recipients = []
                        # recipient <- room.user
                        for recipient in notify.get('recipients', []):
                            recipients = list(SUBSCRIBERS.get(recipient.id, {}).values())
                        recipients.extend(
                            # CURRENT USER FROM ANOTHER DEVICES (sessions)
                            [ws for ws in SUBSCRIBERS[user_id].values() if ws != websocket]
                        )
                        notify['data']['command'] = request['command']
                        for ws in recipients:
                            try:
                                await ws.send(j(notify['data']))
                            except websockets.exceptions.ConnectionClosed as e:
                                fc = []
                                for uid, sessions in SUBSCRIBERS.items():
                                    for key, val in sessions.items():
                                        if val == ws:
                                            fc = [uid, key]
                                            break
                                    if len(fc):
                                        break
                                if len(fc):
                                    logger.info('User %s left chat, stop watching' % fc[0])
                                    SUBSCRIBERS.get(fc[0], {}).pop(fc[1], None)
                                ws.close()
                            except Exception as e:
                                logger.exception('ws chat notify exception:')
                                logger.exception(e)
                                traceback.print_exception(*sys.exc_info())
                                raise e  # NOT WORK, wshandle handle exceptions
                    assert isinstance(response, dict), 'response must be dict'
                    response['command'] = request['command']
                    await websocket.send(j(response))
        print('Start WS Chat Server on ws://%s:%d' % (host, port))
        asyncio.get_event_loop().run_until_complete(
            websockets.serve(wshandle, host, port)
        )
        asyncio.get_event_loop().run_forever()


def chat_tick(user_id, request):
    translation.activate(settings.LANGUAGE_CODE)
    response = {}
    command = request.get('command')
    notifications = []
    if command == 'fetch':
        response = get_chat_room(user_id, request)
    elif command == 'get_rooms':
        response = get_rooms(user_id, request)
    elif command == 'add_message':
        response, notifications = add_message(user_id, request)
    elif command == 'user_typing':
        room = Room.objects.get(users__in=[user_id], pk=request['id'])
        response = {'state': True}
        notifications = []
        for op in room.get_opposites(user_id):
            notifications += [{
                'user_id': op.pk,
                'data': {'room_id': request['id'], 'is_typing': request.get('is_typing'), 'who_typing_id': user_id}
            }]
    elif command == 'read_messages':
        response = read_messages(user_id, request)
    elif command == 'create_first_message':
        response, notifications = create_first_message(user_id, request)
    return response, notifications
