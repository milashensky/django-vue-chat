<template>
    <textarea @input="$emit('input', ($event.target.value + '').trim())"
        v-on="listeners"
        :value="value"
        rows="1"
        style="height: auto"
        placeholder="Write a message"
        :id="inputId || 'chat-input'" class="chat-input"/>
</template>
<script>
export default {
    props: {
        value: String,
        inputId: String
    },
    data () {
        return {
            ctrlPressed: false,
            listeners: {}
        }
    },
    methods: {
        adaptHeight (e) {
            const offset = this.$el.offsetHeight - this.$el.clientHeight
            e.target.style.height = 'auto'
            this.$nextTick(() => {
                e.target.style.height = `${e.target.scrollHeight + offset}px`
            })
        },
        handleEnter (e) {
            if (e.key == 'Enter') {
                if (e.ctrlKey)
                    this.$emit('submit', (e.target.value + '').trim())
                return false
            }
        }
    },
    created () {
        this.listeners = {
            keypress: this.handleEnter,
            keyup: this.adaptHeight,
            input: this.adaptHeight,
            change: this.adaptHeight
        }
    }
}
</script>
<style media="screen" scoped>
    .chat-input {
        margin: 0;
        border-radius: 5px;
        padding: 8px 40px 8px 15px;
        width: 100%;
        resize: none;
        box-shadow: 0px 1px 5px 1px var(--chat-gray-semi);
        height: 42px;
        border: none;
        margin: 5px;
        box-sizing: border-box;
        color: var(--chat-black);
        font-size: 16px;
        background-color: var(--chat-bg)
    }
</style>
