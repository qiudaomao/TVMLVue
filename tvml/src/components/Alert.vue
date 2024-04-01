<template>
    <alertTemplate>
      <title :style="'color: red;'">Hello World!</title>
      <description>Welcom to tvOS, num: {{num}}</description>
      <text v-bind:class="{color: true}">hello</text>
      <button @select="handleClick" @holdselect="handleHoldClick">
        <text>Add</text>
      </button>
    </alertTemplate>
</template>

<script>
export default {
    name: 'alert',
    components: {
    },
    data() {
        return {
            text: "demo",
            num: 0
        }
    },
    mounted() {
        console.log("hello App")
    },
    inject: ['onTest'],
    methods: {
        handleClick() {
            this.num++
            if (this.num == 3) {
                this.onTest && this.onTest()
            }
        },
        handleHoldClick() {
            this.num--
        }
    }
}
</script>
<style>
.color {
    color: rgba(0, 255, 0, 0.8);
}
</style>
