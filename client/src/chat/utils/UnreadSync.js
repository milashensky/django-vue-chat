/*
    updates messages_unread for items. item in item should have
        room_id
    and this room_id should be in $root.roomsData

    requeres $root having:
        data.chat = {
            roomsData: [{id, messages_unread}, ...] -> will contain data for every room of user, and should contain messages_unread
        }
*/
export default {
    data () {
        return {
            items: [],
            updateTO: 0,
        }
    },
    computed: {
        _chatData(){
            return this.$root.chat && this.$root.chat.roomsData
        },
    },
    watch: {
        '$root.chat': {
            handler(val) {
                this._syncUnread()
            },
            deep: true
        },
        items: {
            handler(val) {
                this._syncUnread()
            },
            deep: true
        }
    },
    methods: {
        _syncUnread() {
            clearTimeout(this.updateTO);
            this.updateTO = setTimeout( () => {
                if (!this.$root.chat || !this.$root.chat.roomsData || !this.$root.chat.roomsData.length)
                    return
                clearTimeout(this.updateTO);
                this.$root.chat.roomsData.forEach(room => {
                    let i = this.items.indexOf(this.items.find(x => x.room_id == room.id));
                    if (~i) {
                        this.items[i].messages_unread = room.messages_unread;
                        this.$forceUpdate();
                    }
                })
            }, 10)
        }
    },
    mounted() {
        this._syncUnread()
    }
}
