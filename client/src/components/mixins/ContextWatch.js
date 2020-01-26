import { EventBus } from '@/utils/event-bus.js'


export default {
    computed: {
        context () {
            return EventBus.context
        }
    },
    watch: {
        context: {
            handler (val) {
                this.checkLogin()
            },
            deep: true
        }
    },
    methods: {
        checkLogin () { /* empty */ }
    },
    created () {
        this.checkLogin()
        EventBus.$on('context:response', this.checkLogin)
    },
    beforeDestroy () {
        EventBus.$off('context:response', this.checkLogin)
    }
}
