from django.contrib import admin
from chat.models import Participant, Room


class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'room')


class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at')


admin.site.register(Participant, ParticipantAdmin)
admin.site.register(Room, RoomAdmin)
