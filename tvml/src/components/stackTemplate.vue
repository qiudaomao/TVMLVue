<template>
    <stackTemplate>
        <banner>
            <title>{{name}}</title>
        </banner>
        <collectionList>
        <grid>
            <section>
                <lockup v-for="file in files" :key="file.id" @select="selectFile(file)">
                    <img :src="file.thumbnail" :class="{img: true}" width="300" height="168" />
                    <title>{{file.name}}</title>
                </lockup>
            </section>
        </grid>
        </collectionList>
    </stackTemplate>
</template>
<style>
.img {
    border-radius: 40;
}
</style>

<script setup>
import { ref } from 'vue';
const name = "stackTemplate"
const files = ref([
  {
    id: 1,
    name: 'File 1',
    thumbnail: 'https://picsum.photos/300/168'
  },
  {
    id: 2,
    name: 'File 3',
    thumbnail: 'https://picsum.photos/300/168'
  },
  {
    id: 3,
    name: 'File 2',
    thumbnail: 'https://picsum.photos/300/168'
  }
])
</script>
