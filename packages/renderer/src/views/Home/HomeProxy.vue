<template>
  <div class="flex">
    <n-h2>代理服务器</n-h2>
    <n-button
      class="mla"
      size="small"
      quaternary
    >
      <template #icon>
        <n-icon :component="Add" />
      </template>
    </n-button>
  </div>
  <n-list bordered>
    <n-list-item>
      <template #prefix>
        <div class="w-16">
          美国
        </div>
      </template>
      <div class="flex flex-col">
        <span>127.0.0.1</span>
        <div>
          <n-tag
            type="success"
            size="small"
          >
            vmess
          </n-tag>
        </div>
      </div>
      <template #suffix>
        <div class="flex">
          <n-button
            quaternary
            size="small"
          >
            <template #icon>
              <n-icon
                :component="Edit"
              />
            </template>
          </n-button>
          <n-button
            quaternary
            size="small"
          >
            <template #icon>
              <n-icon
                :component="View"
              />
            </template>
          </n-button>
        </div>
      </template>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import {
  NH2, NList, NListItem, NTag, NIcon, NButton,
} from 'naive-ui'
import { Edit, View, Add } from '@vicons/carbon'
</script>

<style scoped>

</style>
