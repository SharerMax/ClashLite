<template>
  <div class="flex justify-center">
    <n-space
      vertical
      size="large"
    >
      <n-button
        quaternary
        :type="overViewButtonType"
        @click="handleNavItemClick('overView')"
      >
        <template #icon>
          <n-icon>
            <dashboard />
          </n-icon>
        </template>
        活动
      </n-button>
      <n-button
        quaternary
        :type="proxyButtonType"
        @click="handleNavItemClick('proxy')"
      >
        <template #icon>
          <n-icon>
            <server-proxy />
          </n-icon>
        </template>
        代理
      </n-button>
      <n-button
        quaternary
        :type="logButtonType"
        @click="handleNavItemClick('log')"
      >
        <template #icon>
          <n-icon>
            <document />
          </n-icon>
        </template>
        日志
      </n-button>
      <n-button
        quaternary
        :type="settingButtonType"
        @click="handleNavItemClick('setting')"
      >
        <template #icon>
          <n-icon>
            <settings />
          </n-icon>
        </template>
        设置
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace, NIcon } from 'naive-ui'
import {
  Dashboard, ServerProxy, Document, Settings,
} from '@vicons/carbon'
import { ref, computed } from 'vue'

type NavItemType = 'overView' | 'proxy' | 'log' | 'setting'

const active = ref<NavItemType>('overView')
function handleNavItemClick(type: NavItemType) {
  active.value = type
}
const overViewButtonType = computed(() => (active.value === 'overView' ? 'primary' : 'default'))
const proxyButtonType = computed(() => (active.value === 'proxy' ? 'primary' : 'default'))
const logButtonType = computed(() => (active.value === 'log' ? 'primary' : 'default'))
const settingButtonType = computed(() => (active.value === 'setting' ? 'primary' : 'default'))
</script>

<style scoped>
</style>
