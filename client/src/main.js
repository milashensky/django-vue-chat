// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { EventBus } from '@/utils/event-bus.js'
import { toggle } from '@/utils/directives'
import { buildNiceDateTime } from '@/utils/time'


Vue.config.productionTip = false
Vue.directive('toggle', toggle)
Vue.filter('toNiceDateTime', buildNiceDateTime)


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    data: {
        chat: {
            isChat: false
        }
    },
    methods: {
        raise404 () {
            this.$router.history.updateRoute(this.$router.resolve({
                name: '404'
            }).resolved)
        },
        raise500 () {
            this.$router.history.updateRoute(this.$router.resolve({
                name: '500'
            }).resolved)
        }
    },
    created () {
        EventBus.$on('error:500', this.raise500)
    },
    beforeDestroy () {
        EventBus.$off('error:500', this.raise500)
    },
    components: { App },
    template: '<App/>'
})
