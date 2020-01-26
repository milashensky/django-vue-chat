export default {
    methods: {
        _reconnectHandler () {
            this.fetchRoom()
        },
        _addMessageHandler (item) {
            // CLEANUP
            if (!item || !this.room) return
            if (this.room.id != item.room_id) return
            // ADD MESSAGE TO CURRENT ROOM
            this.buildMessages([item.message])
            this.scrollToBottom()
        },
        _fetchHandler (item) { // subscribe to fetch data
            // Messages
            // ROOM
            if (item.room) {
                this.room = item.room
            }
            this.buildMessages(item.messages)
            // fetch more messages on scroll to top
            if (this.fetchingMore) {
                this.fetchingMore = false
                return false
            }
            this.scrollToBottom()
        }
    }
}
