import { chatWS } from '@/chat/utils/chatWS'
import { buildDate, buildNiceTime, moment } from '@/utils/time'
import EventHandlers from './EventHandlers'

Array.prototype.last = function () {
    return this.length ? this[this.length - 1] : undefined
}

export default {
    mixins: [EventHandlers],
    props: {
        userId: {
            type: Number,
            required: true
        },
        autofocus: [Boolean, String],
        roomId: [Number, String]
    },
    data () {
        return {
            message: '',
            messages: [],
            lastSubmitMessageAt: '',
            firstMessageId: '',
            oppositeIsTyping: false,
            room: {},
            fetchingMore: false,
            readTO: 0
        }
    },
    watch: {
        userId (val, old) {
            if (val && old && val != old)
                this._reinit()
        },
        clearRoomId (val, old) {
            this.fixFocus()
            if (val && old && val != old)
                this._reinit()
        }
    },
    computed: {
        clearRoomId () {
            const r = this.roomId || (this.room && this.room.id)
            this.$root.chat.chatRoom = r
            return r
        },
        allMessagesLoaded () {
            return (this.room && !this.room.first_message_id) || (this.room.first_message_id == this.firstMessageId)
        },
        showAuthor () {
            return true
        }
    },
    methods: {
        _reinit () {
            this.messages = []
            this.firstMessageId = ''
            this.fetchingMore = false
            this.$nextTick(() => {
                this.fetchRoom()
            })
        },
        _lastId (items) {
            const item = Array.from(items || []).filter(x => x && x.id).sort((x, y) => y.id - x.id)[0]
            return item && item.id
        },
        fixFocus () {
            this.$nextTick(() => {
                if (this.autofocus && this.$el && this.$el.parentElement.scrollWidth != this.$el.parentElement.clientWidth)
                    this.$el.parentElement.scrollLeft = this.$el.offsetLeft
            })
        },
        scrollToBottom () {
            this.$nextTick(() => {
                if (!this.$refs.messagelist) return
                this.$refs.messagelist.scrollTop = this.$refs.messagelist.scrollHeight - this.$refs.messagelist.clientHeight
            })
        },
        scrollHandle () {
            if (!this.fetchingMore && !this.allMessagesLoaded && this.$refs.messagelist) {
                if (this.$refs.messagelist.scrollTop < 250) {
                    this.fetchingMore = true
                    this.fetchRoom()
                }
                if (this.$refs.messagelist.scrollTop < 10)
                    this.$refs.messagelist.scrollTop = 10
            }
            this.readMessages()
        },
        fetchRoom () {
            let data = {}
            data.id = this.clearRoomId
            if (this.fetchingMore)
                data.messages_first_id = this.firstMessageId
            else
                data.messages_last_id = this._lastId(this.messages)
            chatWS.$emit('fetch', data)
        },
        sendMessage () {
            let message = this.message + ''
            if (!message) {
                alert('Write a message, please')
                return false
            }
            this.lastSubmitMessageAt = moment().unix()
            this.room.messages_unread = 0
            let last = this.messages.filter(x => x.author_id == this.userId).last()
            if (last && message.toLowerCase().trim() == last.content.toLowerCase().trim()) return
            this.messages.push({
                content: message,
                author_id: this.userId,
                created_at: this.lastSubmitMessageAt
            })
            chatWS.$emit('add_message', { message, id: this.clearRoomId })
            this.$nextTick(() => {
                this.message = ''
            })
            this.scrollToBottom()
        },
        buildMessages (messages) {
            messages = [...this.messages, ...messages].sort((x, y) => x.created_at - y.created_at)
            let date = ''
            this.messages = Object.assign([], Array.from(
                new Set(messages.filter(x => x && x.id).map(x => x.id)))
                .map(x => x && messages.find(y => y.id == x))
                .filter(x => x)
            ).reduce((out, x, i) => {
                let last = out[i - 1]
                let xdate = buildDate(x.created_at)
                x.date = ''
                x.author = ''
                if (this.showAuthor && (!last || last.author_id != x.author_id)) {
                    x.author = x.a_name
                }
                if (xdate != date)
                    x.date = date = xdate
                x.time = buildNiceTime(x.created_at)
                out.push(x)
                return out
            }, [])
            this.firstMessageId = this.messages.sort((x, y) => x.id - y.id)[0]
            this.firstMessageId = this.firstMessageId && this.firstMessageId.id
            return this.messages
        },
        readMessages (data) {
            clearTimeout(this.readTO)
            this.readTO = setTimeout(() => {
                clearTimeout(this.readTO)
                if (!this.room || !this.room.id) return
                chatWS.$emit('read_messages', Object.assign({data, id: this.clearRoomId}))
            }, 1000)
        }
    },
    created () {
        chatWS.$on('reconnect', this._reconnectHandler)
        chatWS.$on('add_message', this._addMessageHandler)
        chatWS.$on('fetch', this._fetchHandler)
        this.$root.chat.isChat = true
    },
    mounted () {
        this._reinit()
        this.readMessages()
    },
    beforeDestroy () {
        chatWS.$off('reconnect', this._reconnectHandler)
        chatWS.$off('add_message', this._addMessageHandler)
        chatWS.$off('fetch', this._fetchHandler)
    }
}
