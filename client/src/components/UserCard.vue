<template functional>
    <div class="card">
        <p><b>ID:</b> {{ props.user.id }}</p>
        <p><b>Username:</b> {{ props.user.username }}</p>
        <button class="btn" @click="props.handler(props.user)">Start chat</button>
    </div>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            required: true
        },
        handler: {
            type: Function,
            required: true
        }
    }
}
</script>

<style scoped>
.card {
    padding: 30px 20px;
    box-shadow: 0 0 5px 0 #e3e3e3;
    margin: 10px 0;

}
.card > p {
    margin: 15px 0;
}
</style>
<style src="@/styles/buttons.css" scoped/>
