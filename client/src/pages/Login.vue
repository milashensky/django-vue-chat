<template lang="html">
    <div class="form-container">
        <h2>Login</h2>
        <small class="error" v-for="err in errors.__all__" :key="err">{{ err }}</small>
        <form @submit.prevent="submit">
            <label for="email">
                <nice-input type="email" name="email" placeholder="email" v-model="form.email" :valid="!(errors.email && errors.email.length)"/>
                <small class="error" v-for="err in errors.email" :key="err">{{ err }}</small>
            </label>
            <label for="password">
                <nice-input type="password" name="password" placeholder="password" v-model="form.password" :valid="!(errors.password && errors.password.length)"/>
                <small class="error" v-for="err in errors.password" :key="err">{{ err }}</small>
            </label>
            <button type="submit" class="btn">Login</button>
            <router-link :to="{name: 'Registration'}" class="btn-link">Registration</router-link>
        </form>
    </div>
</template>

<script>
import AuthCntroller from './AuthController'
import resource from '@/utils/resource.js'


export default {
    mixins: [AuthCntroller],
    computed: {
        resource () {
            return resource.Login
        }
    },
    methods: {
        validate () {
            this.errors = {}
            if (!this.form.email)
                this.errors.email = ['This field is required.']
            if (!this.form.password)
                this.errors.password = ['This field is required.']
            return !Object.keys(this.errors).length
        }
    }
}
</script>

<style src="./styles/form.css" scoped/>
<style src="./styles/buttons.css" scoped/>
