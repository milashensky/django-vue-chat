<template lang="html">
</template>

<script>
/*
    show notifications for chat messages_unread
    should be inserted globaly
    requeres $root having:
        data.chat = {
            roomsData: [{id, messages_unread}, ...] -> will contain data for every room of user
            chatRoom -> will contain current page room id if current page is chat room. need for update
                        $router should update this value if there is no chat
        }
        methods.chatInformFilter(room = {id}) -> should return true if we need to show notification for this room. if not defined we show all notifications from '@/every room
        listeners.chat:notification-clicked({room_id, message}) -> should navigate to chat room (contact or support, or any other) on notification click
*/
import { chatWS } from '@/chat/utils/chatWS'
import miniToastr from 'mini-toastr'

Array.prototype.last = function() {
    return this.length ? this[this.length - 1] : undefined
}

export default {
    data() {
        return {
            helper: '',
            _helper: {},
        }
    },
    methods: {
        fetchRoomsData() {
            chatWS.$emit('get_rooms')
        },
        handleRoomsData(data) {
            this.$root.chat.roomsData = data.rooms
            this.$root.chat.roomsData.filter(x => x.messages_unread > 0).forEach(room => this.newMessageHandler({room_id: room.id, message: {content: room.last_message, created_at: room.last_message_at}}))
            this._updateRoot()
        },
        readHandler (data) {
            let room = this.$root.chat.roomsData.find(x => x.id == data.room_id)
            if (!room) return
            room.messages_unread = 0
            this.$root.chat.roomsData = [room, ...this.$root.chat.roomsData.filter(x => x.id != room.id)]
            this._updateRoot()
        },
        fetchHandler (data) {
            if (!data || !data.room || !this.$root.chat) return
            this.$root.chat.roomsData = [data.room, ...(this.$root.chat.roomsData && this.$root.chat.roomsData.filter(x => x.id != data.room.id) || [])]
            this._updateRoot()
        },
        newMessageHandler (data) {
            if (!data || !data.room_id || !this.$root.chat) return
            let room = this.$root.chat.roomsData.find(x => x.id == data.room_id)
            if (!room || !room.id)
                room = {
                    id: data.room_id,
                    messages_unread: 0,
                    contact: data.contact,
                    ticket: data.ticket,
                }
            if (this.$root.chat && this.$root.chat.chatRoom != data.room_id && data.message.author_id != this.$root.context.id) {
                if (room.last_message != data.message.content && room.last_message_at != data.message.created_at) {
                    room.messages_unread++;
                    room.last_message = data.message.content
                    room.last_message_at = data.message.created_at
                }
                if (!this.$root.chatInformFilter || this.$root.chatInformFilter(room))
                    this.informUnread({room_id: data.room_id, message: data.message.content})
            }
            this.$root.chat.roomsData = [room, ...this.$root.chat.roomsData.filter(x => x.id != room.id)]
            this._updateRoot()
        },
        reconnectHandler() {
            this.fetchRoomsData()
        },
        informUnread(data) {
            this._helper.config.allowHtml = true
            if (data && data.message && (!this.$root.chat.isChat || this.$root.chat.chatRoom != data.room_id)) {
                let title = 'New message',
                    date = new Date().getTime(),
                    message = `<p class="chat-notification-message tspan${date}">${data.message}</p>`,
                    cb = () => {
                        let el = Array.from(document.querySelectorAll('.chat-notification-message.tspan' + date)).last(),
                            par = el && el.parentElement.parentElement;
                        par && par.addEventListener('click', () => {
                            this.$root.$emit('chat:notification-clicked', data);
                        })
                        par && par.classList.add('chat-notification')
                }
                this.$nextTick(() => {
                    this.helper(message, title, 5000, cb)
                });
            }
        },
        _updateRoot() {
            this.$root.chat = Object.assign({}, this.$root.chat)
        }
    },
    created() {
        this._helper = miniToastr.init({
            allowHtml: true,
        })
        this.helper = this._helper.info || window.alert;
        chatWS.$on('reconnect', this.reconnectHandler);
        chatWS.$on('add_message', this.newMessageHandler);
        chatWS.$on('read_messages', this.readHandler)
        chatWS.$on('fetch', this.fetchHandler)
        chatWS.$on('get_rooms', this.handleRoomsData)
        this.$nextTick( () => {
            this.fetchRoomsData()
        });
    },
    beforeDestroy(){
        chatWS.$off('reconnect', this.reconnectHandler);
        chatWS.$off('add_message', this.newMessageHandler);
        chatWS.$off('read_messages', this.readHandler)
        chatWS.$off('fetch', this.fetchHandler)
        chatWS.$off('get_rooms', this.handleRoomsData);
    },
}
</script>

<style lang="css">
.chat-notification p.chat-notification-message {
    margin: 0px 0px 0px 10px;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-height: 40px;
}
</style>
