<template>
  <div class="p-4 flex flex-col box-border h-screen">
    <div class="flex-none flex">
      <n-h2>连接</n-h2>
      <n-button
        size="small"
        type="error"
        class="ml-a"
        quaternary
      >
        <template #icon>
          <n-icon :component="Close" />
        </template>
        断开所有
      </n-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <n-scrollbar trigger="none">
        <n-list bordered>
          <n-list-item
            v-for="i in connections.connections"
            :key="i.id"
          >
            <div class="flex flex-col">
              <span>{{ i.metadata.host }}</span>
              <div class="space-x-2 mt-1">
                <n-tag
                  :bordered="false"
                  size="small"
                  type="primary"
                >
                  {{ i.metadata.network }}
                </n-tag>
                <n-tag
                  size="small"
                  :bordered="false"
                  type="warning"
                >
                  {{ i.metadata.type }}
                </n-tag>
                <n-tag
                  size="small"
                  :bordered="false"
                  type="info"
                >
                  {{ i.rule }}
                </n-tag>
                <n-tag
                  size="small"
                  :bordered="false"
                  type="error"
                >
                  {{ i.rulePayload }}
                </n-tag>
              </div>
            </div>
            <template #suffix>
              <n-button
                size="small"
                type="info"
                quaternary
              >
                <template #icon>
                  <n-icon :component="Information" />
                </template>
              </n-button>
            </template>
          </n-list-item>
        </n-list>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NH2, NButton, NIcon, NList, NListItem, NScrollbar, NTag,
} from 'naive-ui'
import { Close, Information } from '@vicons/carbon'
import { ConnectionsResponse } from '../../../packages/share/type'

const connections: ConnectionsResponse = {
  upload: 123,
  download: 456,
  connections: [
    {
      upload: 123,
      download: 456,
      chains: ['proxy'],
      id: '8fa7ca19-0f4e-4b49-87fd-4b432ebafe85',
      metadata: {
        network: 'tcp',
        type: 'Socks5',
        sourceIP: '127.0.0.1',
        destinationIP: '140.82.112.4',
        sourcePort: '2348',
        destinationPort: '443',
        host: 'github.com',
        dnsMode: 'normal',
        processPath: 'chrome.exe',
      },
      rule: 'Proxy',
      rulePayload: 'google.com',
      start: new Date(),
    },
    {
      upload: 123,
      download: 456,
      chains: ['proxy'],
      id: '8fa7ca19-0f4e-4b49-87fd-4b432ebafe85',
      metadata: {
        network: 'tcp',
        type: 'Socks5',
        sourceIP: '127.0.0.1',
        destinationIP: '140.82.112.4',
        sourcePort: '2348',
        destinationPort: '443',
        host: 'github.com',
        dnsMode: 'normal',
        processPath: 'chrome.exe',
      },
      rule: 'Proxy',
      rulePayload: 'google.com',
      start: new Date(),
    },
  ],
}
</script>

<style scoped>
/* :deep(.n-scrollbar-rail--vertical) {
  right: -6px !important;
} */
</style>
