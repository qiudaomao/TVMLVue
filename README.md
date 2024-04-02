A Simple Vue render for TVML

```shell
cd tvml
npm install
npx webpack serve

Open app/TVMLVue/TVMLVue.xcodeproj and run on tvOS simulator
```

What works:

+ supports SFC and defineComponents
+ supports <style>
+ supports TVML events

What not works:
seperate CSS file not work

screenshots:
```javascript
<template>
    <alertTemplate>
      <title :style="'color: red;'">Hello World!</title>
      <description>Welcom to tvOS, num: {{num}}</description>
      <text v-bind:class="{color: true}">hello</text>
      <button @select="handleClick">
        <text>Add {{text}}</text>
      </button>
    </alertTemplate>
</template>

<script>
import { createApp, defineComponent, ref, reactive, inject } from '../lib/VueRender'

const Test = defineComponent({
  setup() {
    const num = ref(0);
    const text = ref("1")
    const handleClick = () => {
      num.value++;
    };
    const handleHoldClick = () => {
      num.value += 10;
    };
    return {
      num,
      text,
      handleClick,
      handleHoldClick,
    };
  }
});

export default Test;

export function showTest() {
  const { app, doc } = createApp(Test);
  app.mountDoc();
  navigationDocument.pushDocument(doc)
}
</script>
<style>
.color {
    color: rgba(255, 0, 0, 0.8);
}
</style>
```

![](./resources/vue-screenshot.png)

![](./resources/debug.png)
