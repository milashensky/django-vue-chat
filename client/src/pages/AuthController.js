import { EventBus } from '@/utils/event-bus.js'
import NiceInput from '@/components/NiceInput'
import ContextWatch from '@/components/mixins/ContextWatch.js'


export default {
    mixins: [ContextWatch],
    components: {
        NiceInput
    },
    data () {
        return {
            form: {},
            errors: {}
        }
    },
    computed: {
        next () {
            return (this.$route.params && this.$route.params.next) || 'Profile'
        }
    },
    methods: {
        validate () {
            return true
        },
        checkLogin () {
            if (EventBus.context.loaded && EventBus.context.id && this.$route.name != this.next)
                this.$router.replace({name: this.next})
        },
        submit () {
            if (this.validate())
                this.resource.post(this.form).then(resp => {
                    EventBus.$emit('context:updated', {id: resp.id})
                    EventBus.$emit('context:update')
                }).catch(resp => {
                    if (resp.status == 400) {
                        resp.json().then(data => {
                            this.errors = Object.assign({}, data.errors)
                        })
                    }
                })
        }
    }
}
