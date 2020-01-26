<template lang="html">
    <div class="">
        <h2>Chat</h2>
        <div class="container">
            <chat autofocus="true" :user-id="userId" v-if="roomId" :room-id="roomId" class="chat-window"/>
            <rooms-list :rooms="rooms"/>
        </div>
    </div>
</template>

<script>
import RoomsList from '@/components/RoomsList'
import Chat from '@/chat/components'
import { EventBus } from '@/utils/event-bus.js'


export default {
    props: {
        rooms: {
            type: Array,
            required: true
        }
    },
    components: {
        Chat,
        RoomsList
    },
    computed: {
        roomId () {
            return this.$route.params.roomId
        },
        userId () {
            return EventBus.context.id
        }
    }
}
</script>

<style lang="css" scoped>
.container {
    display: flex;
    flex-flow: row nowrap;
}
.container >>> .rooms,
.container >>> .chat-window {
    max-height: calc(100vh - 140px);
    width: 100%;
}
.container >>> .chat-window ~ .rooms {
    max-width: 350px;
}
@media (max-width: 700px) {
    .container {
        width: calc(100vw);
        padding-left: 0px!important;
        padding-right: 0px!important;
        scroll-behavior: smooth;
        flex-flow: row nowrap;
        scroll-snap-type: x mandatory;
        overflow-x: auto;
    }
    .container >>> .chat-window,
    .container >>> .chat-window ~ .rooms {
        min-width: calc(100vw);
        max-width: calc(100vw)!important;
        width: 100%;
        order: 1;
        scroll-snap-align: start;
    }
    .container >>> .chat-window {
        order: 2;
        padding-bottom: 15px;
    }
}
</style>
