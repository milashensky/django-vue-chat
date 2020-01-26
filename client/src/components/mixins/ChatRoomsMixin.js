import { chatWS } from '@/chat/utils/chatWS'
import { EventBus } from '@/utils/event-bus.js'


export default {
    data () {
        return {
            rooms: []
        }
    },
    computed: {
        userId () {
            return EventBus.context.id
        }
    },
    methods: {
        getRooms (data) {
            this.rooms = data.rooms
        },
        updateRoom (data) {
            let found = false
            this.rooms = this.rooms.map(room => {
                if (room.id !== data.room_id)
                    return room
                found = true
                switch (data.command) {
                case 'add_message':
                    return {
                        ...room,
                        ...{
                            last_message: data.message.content,
                            messages_unread: room.messages_unread && data.message.author_id !== this.userId ? room.messages_unread + 1 : 0,
                            last_message_at: data.message.created_at
                        }
                    }
                case 'read_messages':
                    room.messages_unread = 0
                    return room
                }
            })
            if (!found)
                chatWS.$emit('get_rooms')
        }
    },
    created () {
        chatWS.$on('get_rooms', this.getRooms)
        chatWS.$on('add_message', this.updateRoom)
        chatWS.$on('read_messages', this.updateRoom)
        chatWS.$emit('get_rooms')
    },
    beforeDestroy () {
        chatWS.$off('get_rooms', this.getRooms)
        chatWS.$off('add_message', this.updateRoom)
        chatWS.$off('read_messages', this.updateRoom)
    }
}
