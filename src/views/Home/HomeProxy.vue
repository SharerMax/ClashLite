<template>
  <!-- TODO 调整布局，头不动 -->
  <div class="p-4">
    <div class="flex">
      <NH2>代理服务器</NH2>
      <NButton
        class="mla"
        size="small"
        quaternary
        @click="handleAddProxySubButtonClick"
      >
        <template #icon>
          <NIcon :component="CloudDownload" />
        </template>
      </NButton>
    </div>
    <NList bordered>
      <NListItem
        v-for="(proxy, index) in proxiesData"
        :key="index"
        :class="{ 'bg-green-900': proxy.name === selectedProxy?.name }"
      >
        <!-- <template #prefix>
          <div class="w-24 lg:w-50 truncate">
            {{ proxy.name }}
          </div>
        </template> -->
        <div class="overflow-hidden cursor-pointer" @click="handleProxyClick(proxy)">
          <NEllipsis> {{ proxy.name }}</NEllipsis>
          <div>
            <NTag type="success" size="small">
              {{ proxy.type }}
            </NTag>
          </div>
        </div>
        <template #suffix>
          <div class="flex">
            <NButton quaternary size="small" disabled>
              <template #icon>
                <NIcon :component="Edit" />
              </template>
            </NButton>
            <NButton quaternary size="small">
              <template #icon>
                <NIcon :component="View" />
              </template>
            </NButton>
          </div>
        </template>
      </NListItem>
    </NList>
  </div>
  <NModal
    v-model:show="showEditProxySub"
    class="w-100"
    preset="card"
    closable
    :title="proxySubFormTitle"
    size="small"
  >
    <NForm
      ref="proxySubForm"
      label-placement="left"
      size="small"
      :rules="proxySubFormRules"
      :model="subProxyData"
    >
      <NFormItem label="订阅" path="url">
        <NInput v-model:value="subProxyData.url" placeholder="订阅地址" />
      </NFormItem>
      <NFormItem label="类型" path="type">
        <NRadioGroup v-model:value="subProxyData.type">
          <NRadioButton value="plain">
            PLAIN
          </NRadioButton>
          <NRadioButton label="BASE64" value="base64">
            BASE64
          </NRadioButton>
          <NRadioButton value="sip008">
            SIP008
          </NRadioButton>
          <NRadioButton value="clash">
            CLASH
          </NRadioButton>
        </NRadioGroup>
      </NFormItem>
      <NFormItem label="更新" path="period">
        <NInputNumber
          v-model:value="subProxyData.period"
          placeholder="更新周期；[10, 10000]"
          :min="10"
          :max="10000"
        >
          <template #suffix>
            分钟
          </template>
        </NInputNumber>
      </NFormItem>
    </NForm>
    <template #action>
      <div class="flex">
        <NButton class="ml-a" @click="handleProxySubCancelButtonClick">
          取消
        </NButton>
        <NButton class="ml-4" type="primary" @click="handleProxySubSaveButtonClick">
          保存
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import {
  NButton, NEllipsis, NForm, NFormItem, NH2, NIcon, NInput, NInputNumber, NList, NListItem,
  NModal, NRadioButton, NRadioGroup, NTag,
} from 'naive-ui'
import { CloudDownload, Edit, View } from '@vicons/carbon'
import { ref } from 'vue'
import type { ClashSettingSubscribe } from 'share/dist/type'
import { isSubScribeEqual } from 'share/dist/utils/setting'
import type { Proxies, ProxyGroupInfo, ProxyInfo } from 'share/dist/type/clash/api'
import { proxy as fetchProxy, proxyProvider, selectProxy } from '@/render/api/clash'

const showEditProxySub = ref(false)
function handleAddProxySubButtonClick() {
  showEditProxySub.value = true
}
interface ProxiesObj {
  [k: string]: ProxyInfo | ProxyGroupInfo
}

const selectedProxy = ref<ProxyInfo | ProxyGroupInfo>()
function handleProxyClick(proxy: ProxyInfo | ProxyGroupInfo) {
  selectedProxy.value = proxy
  selectProxy('Proxy', proxy.name).then(() => {})
}

const proxiesData = ref<(ProxyInfo | ProxyGroupInfo)[]>([])
let savedProxySub = window.clash.getProxySubscribe()
if (savedProxySub.url && savedProxySub.updateTime) {
  proxyProvider('subscribe-proxies').then((res) => {
    proxiesData.value = res.data.proxies
    return fetchProxy('Proxy')
  }).then((res) => {
    const maybeProxyGroupInfo = 'now' in res.data ? res.data : null
    if (maybeProxyGroupInfo) {
      selectedProxy.value = proxiesData.value.find(proxy => proxy.name === maybeProxyGroupInfo.now)
    }
  })
}

// prevent side effect of proxy object
const subProxyData = ref<ClashSettingSubscribe>({ ...savedProxySub })
const proxySubFormTitle = ref(savedProxySub.url ? '编辑订阅' : '新增订阅')
const proxySubForm = ref<null | FormInst>(null)
function handleProxySubSaveButtonClick() {
  proxySubForm.value?.validate((errors) => {
    if (!errors) {
      showEditProxySub.value = false
      if (!isSubScribeEqual(savedProxySub, subProxyData.value)) {
        // IPC transform pure js object
      // https://www.electronjs.org/docs/latest/breaking-changes#behavior-changed-sending-non-js-objects-over-ipc-now-throws-an-exception
        savedProxySub = { ...subProxyData.value }
        window.clash.saveProxySubscribe(savedProxySub)
      }
      proxySubFormTitle.value = '编辑订阅'
    }
  })
}

function handleProxySubCancelButtonClick() {
  showEditProxySub.value = false
}

const proxySubFormRules: FormRules = {
  url: {
    required: true,
    type: 'url',
    message: '请输入正确的订阅地址',
    trigger: 'input',
  },
  type: {
    required: true,
    type: 'string',
  },
  period: {
    required: true,
    type: 'integer',
    message: '请输入正确的更新周期',
    trigger: 'input',
  },
}
</script>

<style scoped>
:deep(.n-list-item__main) {
  overflow: hidden;
}
</style>
