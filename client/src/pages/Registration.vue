<template lang="html">
    <div class="form-container">
        <h2>Registration</h2>
        <form @submit.prevent="submit">
            <label for="email">
                <nice-input type="email" name="email" placeholder="email" v-model="form.email" :required="true" :valid="!(errors.email && errors.email.length)"/>
                <small class="error" v-for="err in errors.email" :key="err">{{ err }}</small>
            </label>
            <label for="name">
                <nice-input type="text" name="username" placeholder="username" v-model="form.username" :required="true" :valid="!(errors.username && errors.username.length)"/>
                <small class="error" v-for="err in errors.username" :key="err">{{ err }}</small>
            </label>
            <label for="password">
                <nice-input type="password" name="password" placeholder="password" v-model="form.password1" :required="true" :valid="!(errors.password1 && errors.password1.length)"/>
                <small class="error" v-for="err in errors.password1" :key="err">{{ err }}</small>
            </label>
            <label for="password2">
                <nice-input type="password" name="password2" placeholder="repeat password" v-model="form.password2" :required="true" :valid="!(errors.password2 && errors.password2.length)"/>
                <small class="error" v-for="err in errors.password2" :key="err">{{ err }}</small>
            </label>
            <button type="submit" class="btn">Sign up</button>
            <router-link :to="{name: 'Login'}" class="btn-link">Login</router-link>
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
            return resource.Registration
        }
    },
    methods: {
        validate () {
            this.errors = {}
            if (!this.form.email)
                this.errors.email = ['This field is required.']
            if (!this.form.username)
                this.errors.username = ['This field is required.']
            if (!this.form.password1)
                this.errors.password1 = ['This field is required.']
            if (!this.form.password2)
                this.errors.password2 = ['This field is required.']
            if (this.form.password1 != this.form.password2)
                this.errors.password1 = ['Passwords does not match.']
            return !Object.keys(this.errors).length
        }
    }
}
</script>

<style src="./styles/form.css" scoped/>
<style src="./styles/buttons.css" scoped/>
