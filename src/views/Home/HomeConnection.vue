<template>
  <div class="p-4 flex flex-col box-border h-screen">
    <div class="flex-none flex">
      <NH2>连接</NH2>
      <NButton
        size="small"
        type="error"
        class="ml-a"
        quaternary
      >
        <template #icon>
          <NIcon :component="Close" />
        </template>
        断开所有
      </NButton>
    </div>
    <div class="flex-1 overflow-hidden">
      <NScrollbar trigger="none">
        <NList bordered>
          <NListItem
            v-for="i in connections.connections"
            :key="i.id"
          >
            <div class="flex flex-col">
              <span>{{ i.metadata.host }}</span>
              <div class="space-x-2 mt-1">
                <NTag
                  :bordered="false"
                  size="small"
                  type="primary"
                >
                  {{ i.metadata.network }}
                </NTag>
                <NTag
                  size="small"
                  :bordered="false"
                  type="warning"
                >
                  {{ i.metadata.type }}
                </NTag>
                <NTag
                  size="small"
                  :bordered="false"
                  type="info"
                >
                  {{ i.rule }}
                </NTag>
                <NTag
                  size="small"
                  :bordered="false"
                  type="error"
                >
                  {{ i.rulePayload }}
                </NTag>
              </div>
            </div>
            <template #suffix>
              <NButton
                size="small"
                type="info"
                quaternary
              >
                <template #icon>
                  <NIcon :component="Information" />
                </template>
              </NButton>
            </template>
          </NListItem>
        </NList>
      </NScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton, NH2, NIcon, NList, NListItem, NScrollbar, NTag,
} from 'naive-ui'
import { Close, Information } from '@vicons/carbon'
import type { Api } from '../../../packages/share/type'

const connections: Api.Connections = {
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
