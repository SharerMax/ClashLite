<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <router-view />
    </n-message-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import {
  NConfigProvider, NGlobalStyle, NMessageProvider, darkTheme, useOsTheme,
} from 'naive-ui'
import { computed } from 'vue'

const osTheme = useOsTheme()
const theme = computed(() => {
  console.log(osTheme, darkTheme)
  return osTheme.value === 'dark' ? darkTheme : null
})
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  height: 100%;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.logo-box span {
  width: 74px;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
