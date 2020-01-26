from django.db import models, transaction


class RoomQuerySet(models.QuerySet):

    def get_room(self, users, *args, **kwargs):
        users = [i for i in users]
        return self.filter(users__in=users).distinct().annotate(pcnt=models.Count('participants')).filter(pcnt=len(users)).first()

    @transaction.atomic
    def get_or_create_room(self, *args, **kwargs):
        from .models import Participant

        users = kwargs.pop('users')
        room, new = self.get_room(users=users, *args, **kwargs), False
        if not room:
            room, new = self.create(*args, **kwargs), True
            [Participant.objects.get_or_create(user_id=user, room=room) for user in users]
        return room, new
