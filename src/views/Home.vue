<template>
    <div class="home">
        <img
            alt="Vue logo"
            src="../assets/logo.png">
        <hello-world msg="Welcome to Your Vue.js App" />
        <drawer />
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Drawer from '@/components/drawer/src/drawer.vue'

export default {
    name: 'Home',
    components: {
        HelloWorld,
        Drawer,
    },
}
</script>
