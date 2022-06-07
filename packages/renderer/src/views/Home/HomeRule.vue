<template>
  <n-layout>
    <div class="flex items-baseline">
      <n-h2>
        规则配置
      </n-h2>
      <div class="ml-a">
        <n-button
          quaternary
          size="small"
          type="primary"
        >
          <template #icon>
            <n-icon :component="Add" />
          </template>
          新增
        </n-button>
      </div>
    </div>

    <div>
      <n-list bordered>
        <n-list-item bordered>
          <template #prefix>
            <n-text type="primary">
              ProxyList
            </n-text>
          </template>
          <n-ellipsis>
            https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="success"
            >
              PROXY
            </n-tag>
          </template>
        </n-list-item>
        <n-list-item bordered>
          <template #prefix>
            <n-text type="primary">
              Google
            </n-text>
          </template>
          <n-ellipsis>
            https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="success"
            >
              PROXY
            </n-tag>
          </template>
        </n-list-item>
        <n-list-item bordered>
          <template #prefix>
            <n-text type="primary">
              CN:SITE
            </n-text>
          </template>
          <n-ellipsis>
            https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="info"
            >
              DIRECT
            </n-tag>
          </template>
        </n-list-item>
      </n-list>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import {
  NLayout, NH2, NTag, NList, NText, NListItem, NButton, NIcon, NEllipsis,
} from 'naive-ui'
import { Add } from '@vicons/carbon'
</script>

<style scoped>
:deep(.n-list-item__main) {
  overflow: hidden;
}

</style>
