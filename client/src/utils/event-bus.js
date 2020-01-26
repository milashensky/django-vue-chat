import Vue from 'vue'
import resource from './resource'

export const EventBus = new Vue({
    data: {
        context: {
            loaded: false,
            fetching: false
        }
    },
    methods: {
        fetchContext () {
            this.context.fetching = true
            resource.Context.get().then(resp => {
                this.context = Object.assign({
                    fetching: false,
                    loaded: true
                }, resp)
                this.$emit('context:response', this.context)
            }).catch(error => {
                this.$emit('error:500', error)
            })
        },
        updateContext (data) {
            this.context = Object.assign({}, this.context, data)
        }
    },
    created () {
        this.fetchContext()
        this.$on('context:updated', this.updateContext)
        this.$on('context:update', this.fetchContext)
    },
    beforeDestroy () {
        this.$off('context:updated', this.updateContext)
        this.$off('context:update', this.fetchContext)
    }
})
