<template functional>
    <div class="rooms">
        <router-link class="room-card" v-for="room in props.rooms" :key="room.id" :to="{name: 'ChatRoom', params: {roomId: room.id}}">
            <div class="room-id">ID: {{ room.id }}</div>
            <div class="center">
                <span class="opposites">
                    {{ room.opposites.map(x => x.username).join(', ') }}
                </span>
                <span class="last-message">{{ room.last_message }}</span>
            </div>
            <div class="right-block">
                <span class="last-message-time">{{ room.last_message_at | toNiceDateTime }}</span>
                <span class="badge" v-if="room.messages_unread">{{ room.messages_unread }}</span>
            </div>
        </router-link>
        <div class="" v-if="!props.rooms.length">
            You got no chat rooms yet
        </div>
    </div>
</template>

<script>
export default {
    props: {
        rooms: {
            type: Array,
            required: true
        }
    }
}
</script>

<style src="@/styles/badge.css" scoped/>
<style lang="css" scoped>
.rooms {
    overflow-y: auto;
    display: flex;
    flex-flow: column;
}
.room-card {
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
    justify-content: space-between;
    border-bottom: solid 1px #e1e2e4;
    color: #4d4e50;
    text-decoration: none;
    padding: 20px;
    transition: all .3s ease;
}
.room-card:first-of-type {
    border-top: solid 1px #e1e2e4;
}
.room-card:hover {
    background-color: #e1e2e46b;
}
.room-card.active-exact {
    background-color: #e1e2e44a;
}
.room-card .opposites {
    font-weight: bold;
    padding-bottom: 20px;
}
.room-card .opposites,
.room-card .last-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}
.center,
.right-block {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    justify-content: space-between;
}
.center {
    padding: 0px 20px;
    align-items: flex-start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1
}
.room-card .last-message-time {
    display: block;
}
</style>
