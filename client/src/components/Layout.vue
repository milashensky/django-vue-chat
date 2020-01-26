<template>
    <div class="layout" v-if="context.loaded && context.id">
        <v-nav/>
        <main>
            <router-view/>
        </main>
    </div>
</template>

<script>
import ContextWatch from '@/components/mixins/ContextWatch.js'
import VNav from './VNav'
import { EventBus } from '@/utils/event-bus.js'

export default {
    mixins: [ContextWatch],
    components: {
        VNav
    },
    methods: {
        checkLogin () {
            if (EventBus.context.loaded && !EventBus.context.id && !EventBus.context.fetching)
                this.$router.replace({name: 'Login', params: {next: this.$route.name}})
        }
    }
}
</script>

<style scoped>
.layout {
    flex: 1;
    width: 100%;
}
.layout main {
}
</style>
