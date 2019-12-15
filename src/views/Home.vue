<template>
    <div class="home">
        <img
            alt="Vue logo"
            src="../assets/logo.png"
            @click="$share.sys({url: 'www.baidu.com'})">
        <hello-world msg="Welcome to Your Vue.js App" />
        <drawer depth="70vw" />
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
