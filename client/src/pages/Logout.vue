<script>
import { EventBus } from '@/utils/event-bus.js'
import resource from '@/utils/resource.js'


export default {
    functional: true,
    render (createElement, context) {
        const $root = context.parent.$root
        resource.Logout.post().then(resp => {
            EventBus.$emit('context:updated', {id: null})
            $root.$router.push({name: 'Login'})
        })
        return createElement('span')
    }
}
</script>
