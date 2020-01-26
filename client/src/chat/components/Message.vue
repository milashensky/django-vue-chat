<template functional lang="html">
    <div class="chat-message" :class="{owned: props.userId == props.message.author_id}">
        <div class="chat-messagedate" v-if="props.message.date">
            <span>
                {{ props.message.date }}
            </span>
        </div>
        <div class="message-content">
            <b class="message-author" v-if="props.message.author">{{props.message.author}}</b>
            <div v-html="props.message.content"/>
            <small class="message-time" v-if="props.message.time">{{props.message.time}}</small>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        userId: {
            type: Number,
            required: true
        },
        message: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="css" scoped>
.chat-message {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    margin: 5px 10px;
}
.chat-message.owned + .chat-message:not(.owned),
.chat-message:not(.owned) + .chat-message.owned {
    margin-top: 15px;
}
.chat-message.owned {
    align-items: flex-end;
}
.chat-message .message-content {
    background-color: var(--chat-active);
    border-radius: 5px;
    box-shadow: 0px 2px 3px 2px var(--chat-gray-semi);
    color: var(--chat-bg);
    padding: 5px 15px;
    word-break: break-word;
    max-width: calc(100% - 60px);
}
.chat-message.owned .message-content {
    background-color: var(--chat-gray);
    color: var(--chat-active);
}
.chat-message .chat-messagedate {
    display: flex;
    width: 100%;
    justify-content: center;
}
.chat-message .chat-messagedate span {
    padding: 2px 15px;
    border-radius: 20px;
    font-size: 15px;
    margin: 10px;
    background-color: var(--chat-gray-semi);
    color: var(--chat-bg);
}
.chat-message .message-content .message-time {
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
}
</style>
<style media="screen">
.chat-message .message-content * {
    color: var(--chat-bg);
    font-size: 16px;
}
.chat-message.owned .message-content * {
    color: var(--chat-active);
    font-size: 16px;
}
</style>
