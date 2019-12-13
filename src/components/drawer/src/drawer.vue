<template>
    <div
        class="rl-drawer__wrap"
        :style="[depthStyle, opacityStyle]"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd">
        <div
            class="rl-drawer__body"
            :class="direction"
            :style="translateVariable"
            @click.stop>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

type Direction = 'left'|'right'|'top'|'bottom'

@Component({
    name: 'Drawer',
})
export default class extends Vue {
    @Prop({
        required: false,
        default: '50vw',
        validator: (val) => {
            return /^([0-9]*[.]*[0-9]+)(px|vw|vh)$/.test(val)
        },
    }) depth!: string

    @Prop({
        required: false,
        default: 'left',
        validator: (val) => {
            return ['left', 'right', 'top', 'bottom'].includes(val)
        },
    }) direction!: Direction

    get isHorizontal() {
        return ['left', 'right'].includes(this.direction)
    }

    windowWidth: number = 0
    windowHeight: number = 0

    get depthStyle() {
        return {
            '--drawer-depth': `${this.pixelDepth}px`,
            '--drawer-depth-negative': `-${this.pixelDepth}px`,
        }
    }

    get opacityStyle() {
        return {
            '--opacity': `${this.position / 100}`,
        }
    }

    get pixelDepth(): number {
        try {
            const t = /^([0-9]*[.]*[0-9]+)(px|vw|vh)$/.exec(this.depth)!
            const number = parseInt(t[1])
            switch (t[2]) {
            case 'vw': return Math.floor(number / 100 * this.windowWidth)
            case 'vh': return Math.floor(number / 100 * this.windowHeight)
            case 'px':
            default: return Math.floor(number)
            }
        } catch {
            return Math.floor(this.windowWidth * 0.5)
        }
    }

    position: number = 0
    touchPrevX: number = 0
    touchPrevY: number = 0
    touchX: number = 0
    touchY: number = 0
    isOpenTrend: boolean = false
    animationTimeout: number = 0;

    @Watch('position')
    onPositionChange(newV: number, oldV: number) {
        this.isOpenTrend = newV > oldV
    }

    get translateVariable() {
        return this.translateVariableHelper()
    }

    get translateVariableHelper() {
        switch (this.direction) {
        default:
        case 'left':
            return () => { return { '--translate': `translateX(${this.position}%)` } }
        case 'right':
            return () => { return { '--translate': `translateX(-${this.position}%)` } }
        case 'top':
            return () => { return { '--translate': `translateY(${this.position}%)` } }
        case 'bottom':
            return () => { return { '--translate': `translateY(-${this.position}%)` } }
        }
    }

    limitSetter(t: number) {
        this.position = t > 100 ? 100 : t < 0 ? 0 : t
    }

    get moveHelper() {
        switch (this.direction) {
        default:
        case 'left':
            return (event: { source: string, x: number, y: number }) => {
                this.limitSetter(this.position + event.x / this.pixelDepth * 100)
            }
        case 'right':
            return (event: { source: string, x: number, y: number }) => {
                this.limitSetter(this.position - event.x / this.pixelDepth * 100)
            }
        case 'top':
            return (event: { source: string, x: number, y: number }) => {
                this.limitSetter(this.position + event.y / this.pixelDepth * 100)
            }
        case 'bottom':
            return (event: { source: string, x: number, y: number }) => {
                this.limitSetter(this.position - event.y / this.pixelDepth * 100)
            }
        }
    }

    // Touch事件用于设置flag及记录pos
    onTouchStart(event: TouchEvent) {
        clearTimeout(this.animationTimeout)
        const { clientX, clientY } = event.changedTouches[0]
        this.touchPrevX = clientX
        this.touchPrevY = clientY
    }
    onTouchMove(event: TouchEvent) {
        const { clientX, clientY } = event.changedTouches[0]
        this.moveHelper({ source: 'touch', x: clientX - this.touchPrevX, y: clientY - this.touchPrevY })
        this.touchPrevX = clientX
        this.touchPrevY = clientY
    }
    onTouchEnd() {
        const toOpen = this.position > 85 || (this.position > 15 && this.isOpenTrend)
        if (toOpen) {
            const t = () => {
                this.animationTimeout = setTimeout(() => {
                    const pos = this.position * 0.9 + 10.7
                    if (pos < 100) {
                        this.position = pos
                        t()
                    } else {
                        this.position = 100
                    }
                }, 17)
            }
            t()
        } else {
            const t = () => {
                this.animationTimeout = setTimeout(() => {
                    const pos = this.position * 0.9 - 0.7
                    if (pos > 0) {
                        this.position = pos
                        t()
                    } else {
                        this.position = 0
                    }
                }, 17)
            }
            t()
        }
    }

    created() {
        this.windowWidth = document.body.clientWidth
        this.windowHeight = document.body.clientHeight
    }
}
</script>

<style lang="scss" scoped>
.rl-drawer__wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    overflow: hidden;
    background-color: rgba(0, 0, 0, calc(.8 * var(--opacity)));
}

.rl-drawer__body {
    position: absolute;
    transform: var(--translate);

    background-color: green;
    &.left, &.right {
        height: 100%;
        width: var(--drawer-depth);
    }
    &.top, &.bottom {
        width: 100%;
        height: var(--drawer-depth);
    }
    &.left {
        left: var(--drawer-depth-negative);
    }
    &.right {
        right: var(--drawer-depth-negative);
    }
    &.top {
        left: var(--drawer-depth-negative);
    }
    &.bottom {
        bottom: var(--drawer-depth-negative);
    }
}
</style>
