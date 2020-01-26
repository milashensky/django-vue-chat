import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/pages/NotFound'
import SystemError from '@/pages/SystemError'
import Logout from '@/pages/Logout'
import Login from '@/pages/Login'
import Registration from '@/pages/Registration'
import innerRoutes from './inner'

Vue.use(Router)
export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'active-exact',
    routes: [
        innerRoutes,
        {
            path: '/registration',
            name: 'Registration',
            component: Registration,
            meta: {
                title: 'Registration'
            }
        }, {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: 'Login'
            }
        }, {
            path: '/logout',
            name: 'Logout',
            component: Logout,
            meta: {
                title: 'Logout'
            }
        }, {
            path: '/404',
            name: '404',
            component: NotFound,
            meta: {
                title: '404'
            }
        }, {
            path: '/500',
            name: '500',
            component: SystemError,
            meta: {
                title: '500'
            }
        }, {
            path: '*',
            component: NotFound
        }
    ]
})
