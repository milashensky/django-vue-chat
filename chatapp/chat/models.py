from django.db import models
from django.contrib.auth.models import User

from common.fields import JsonField
from chat.managers import RoomQuerySet


class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participants')
    room = models.ForeignKey('Room', on_delete=models.CASCADE, related_name='participants')
    visited_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return '{s.user_id} [{s.room_id}]'.format(s=self)

    class Meta:
        unique_together = ('room', 'user')


class Room(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    last_message_at = models.DateTimeField(auto_now_add=True, db_index=True)
    last_message = models.TextField(default='')
    users = models.ManyToManyField(User, through='Participant')
    objects = RoomQuerySet.as_manager()
    first_message_id = models.TextField(default='')

    def get_messages_unread(self, user):
        participant = self.participants.get(user=user)
        return self.messages.filter(created_at__gt=participant.visited_at)

    def get_opposites(self, user):
        participant = self.participants.get(user=user)
        return self.users.exclude(id=participant.user_id)

    def __str__(self):
        return 'id: {s.id} [{s.created_at}]'.format(s=self)


class Message(models.Model):
    author = models.ForeignKey(
        User,
        related_name='rooms_by_author',
        on_delete=models.CASCADE
    )
    room = models.ForeignKey(
        Room,
        related_name='messages',
        on_delete=models.CASCADE
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    extra = JsonField(null=True, default="")

    def __str__(self):
        return '{s.author} [{s.created_at}] to {s.room_id}: {s.content}'.format(s=self)
