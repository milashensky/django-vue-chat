<template>
<div id="app">
    <router-view />
</div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
* {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    box-sizing: border-box;
}
#app {
    min-height: 100vh;
    color: #4d4e50;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
