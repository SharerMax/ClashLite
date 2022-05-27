<template>
    <div class="page-wrapper">
       <side-nav/>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import SideNav from '../components/SideNav.vue'

</script>
<script lang="ts">
export default defineComponent({
  name: 'AppHome',
})
</script>

<style scoped>
.page-wrapper {
    width: 100%;
    height: 100%;
}
</style>
