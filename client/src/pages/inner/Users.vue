<template>
    <div class="">
        <h2>Users</h2>
        <div class="users-list">
            <user-card :handler="startChat" :user="user" :key="user.id" v-for="user in users"/>
        </div>
        <pagination :total="count" :per-page="perPage" :page="page" :set-page="setPage"/>
    </div>
</template>

<script>
import UserCard from '@/components/UserCard'
import Pagination from '@/components/Pagination'
import resource from '@/utils/resource.js'
import { chatWS } from '@/chat/utils/chatWS'


export default {
    components: {
        Pagination,
        UserCard
    },
    data () {
        return {
            perPage: 10,
            page: 0,
            users: [],
            count: 0
        }
    },
    methods: {
        fetchUsers () {
            resource.Users.get({page: this.page, per_page: this.perPage}).then(resp => {
                this.users = resp.users
                this.count = resp.count
            })
        },
        goToRoom (data) {
            chatWS.$off('create_first_message', this.goToRoom)
            this.$router.push({name: 'ChatRoom', params: {roomId: data.room_id}})
        },
        startChat (user) {
            chatWS.$on('create_first_message', this.goToRoom)
            chatWS.$emit('create_first_message', {interlocutor_id: user.id})
        },
        setPage (page) {
            this.page = page
            this.fetchUsers()
        }
    },
    created () {
        this.fetchUsers()
    }
}
</script>

<style scoped>
</style>
