import Layout from '@/components/Layout'
import Profile from '@/pages/inner/Profile'
import Chat from '@/pages/inner/Chat'
import Users from '@/pages/inner/Users'


export default {
    path: '/',
    redirect: '/',
    component: Layout,
    children: [
        {
            path: '/',
            name: 'Profile',
            component: Profile,
            meta: {
                title: 'Profile'
            }
        },
        {
            path: '/users',
            name: 'Users',
            component: Users,
            meta: {
                title: 'Users'
            }
        },
        {
            path: 'chat',
            name: 'Chat',
            component: Chat,
            meta: {
                title: 'Chat'
            }
        },
        {
            path: 'chat/:roomId',
            name: 'ChatRoom',
            component: Chat,
            meta: {
                title: 'Chat'
            }
        }
    ]
}
