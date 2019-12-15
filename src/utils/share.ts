import Vue, { VueConstructor } from 'vue'

interface ShareData {
    title?: string
    text?: string
    url?: string
    files?: File[]
}

class Share {
    public static sys(data: ShareData) {
        if (navigator.share) {
            return navigator.share(data)
        } else {
            return Promise.reject(new Error('Not supported'))
        }
    }
}

export default {
    install: (Vue: VueConstructor) => {
        Vue.prototype.$share = Share
    },
}

declare module 'vue/types/vue' {
// 3. 声明为 Vue 补充的东西
  interface Vue {
    $share: string
  }
}
