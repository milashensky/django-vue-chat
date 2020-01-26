<template lang="html">
    <div class="profile">
        <h2>Profile</h2>
        <form @submit.prevent="submit">
            <label for="email">
                <nice-input type="email" name="email" placeholder="email" v-model="form.email" :required="true" :valid="!(errors.email && errors.email.length)"/>
                <small class="error" v-for="err in errors.email" :key="err">{{ err }}</small>
            </label>
            <label for="name">
                <nice-input type="text" name="username" placeholder="username" v-model="form.username" :required="true" :valid="!(errors.username && errors.username.length)"/>
                <small class="error" v-for="err in errors.username" :key="err">{{ err }}</small>
            </label>
            <button type="submit" class="btn">Save</button>
        </form>
    </div>
</template>

<script>
import FormMixin from '@/components/mixins/FormMixin.js'
import resource from '@/utils/resource.js'


export default {
    mixins: [FormMixin],
    computed: {
        resource () {
            return resource.Profile.put
        }
    },
    methods: {
        validate () {
            this.errors = {}
            if (!this.form.email)
                this.errors.email = ['This field is required.']
            if (!this.form.username)
                this.errors.username = ['This field is required.']
            return !Object.keys(this.errors).length
        },
        success () {
            alert('Success!')
        }
    },
    watch: {
        context: {
            handler (val) {
                this.form = {...val}
            },
            deep: true
        }
    },
    created () {
        this.form = {...this.context}
    }
}
</script>

<style src="@/styles/form.css" scoped/>
<style src="@/styles/buttons.css" scoped/>
<style scoped>
.profile {
    max-width: 600px;
    margin: 15px;
}
</style>
