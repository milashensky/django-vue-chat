<template lang="html">
    <div class="chat chat-wrapper">
        <div class="message-list-warp" ref="messagelist" @scroll="scrollHandle">
            <div class="no-messages" v-if="!messages || !messages.length">
                No messages yet
            </div>
            <div class="load-more" v-if="!allMessagesLoaded">
                <div class="spinner" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <message v-for="message in messages" :key="message.id" :user-id="userId" :message="message"/>
        </div>
        <form @submit.prevent="sendMessage" class="chat-messageform" v-if="room && room.id">
            <chat-input v-model="message" @submit="sendMessage"/>
            <button type="submit" name="send">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 535.5 535.5">
                    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75"/>
                </svg>
            </button>
        </form>
    </div>
</template>

<script>
import ChatController from '@/chat/utils/ChatController'

import Message from './Message'
import ChatInput from './ChatInput'


export default {
    mixins: [
        ChatController
    ],
    components: {
        Message,
        ChatInput
    },
    created () {
        this.fetchRoom()
    },
    mounted () {
        this.fixFocus()
    }
}
</script>
<style lang="css">
.chat {
    --chat-active: #007bff;
    --chat-black: #5f5f5f;
    --chat-bg: #fff;
    --chat-black-semi: #5f5f5fbd;
    --chat-active-semi: #007bffbd;
    --chat-gray: #f8f9fa;
    --chat-gray-semi: #bdbdbdad;
}
</style>
<style lang="css" scoped>
.chat.chat-wrapper {
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    color: var(--chat-black);
    height: 100vh;
}
.chat .chat-messageform {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    position: relative;
}
.chat .chat-messageform button {
    position: absolute;
    top: 0px;
    right: 8px;
    border: none;
    background: none;
    width: 30px;
    height: 100%;
}
.chat .chat-messageform button svg polygon {
    fill: var(--chat-black-semi);
}
.chat .chat-messageform button:active svg polygon,
.chat .chat-messageform button:hover svg polygon {
    fill: var(--chat-active);
}
.chat .message-list-warp .no-messages,
.chat .message-list-warp {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
}
.chat .message-list-warp {
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: var(--chat-bg);
    border-radius: 4px;
}
.chat .message-list-warp::-webkit-scrollbar {
    width: 6px;
    background-color: #f0f0f050;
}
.chat .message-list-warp:hover::-webkit-scrollbar-thumb {
    background-color: #c1c1c150;
}
.chat .message-list-warp:hover::-webkit-scrollbar-track {
    background-color: #f0f0f050;
}
.chat .message-list-warp::-webkit-scrollbar,
.chat .message-list-warp::-webkit-scrollbar-track {
    background-color: #f0f0f010;
    border-radius: 4px;
}
.chat .message-list-warp::-webkit-scrollbar-thumb {
    background-color: #c1c1c110;
    border-radius: 4px;
}
.chat .message-list-warp .load-more,
.chat .message-list-warp .no-messages {
    justify-content: center;
    align-items: center;
    display: flex;
}
.chat .spinner {
    height: 25px;
    width: 25px;
    vertical-align: text-bottom;
    border: 3px solid var(--chat-active-semi);
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: spinner-rotate .5s linear infinite;
    animation: spinner-rotate .5s linear infinite;

}
.chat .sr-only {
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    opacity: 0;
}
@-webkit-keyframes spinner-rotate {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner-rotate {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>
