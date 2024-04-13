<template>
    <alertTemplate>
      <title :style="'color: red;'">Hello World!</title>
      <description>Welcom to tvOS, num: {{num}}</description>
      <text v-bind:class="{color: true}">hello</text>
      <button @select="handleClick">
        <text>Add</text>
      </button>
    </alertTemplate>
</template>

<script setup>
import { ref, inject } from '../lib/VueRender'
const text = ref('demo')
const num = ref(0)
const handleClick = inject('onSelect')
</script>

<style>
.color {
  color: rgba(0, 255, 0, 0.8);
}
</style>
