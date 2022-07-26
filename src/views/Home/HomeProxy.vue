<template>
  <!-- TODO 调整布局，头不动 -->
  <div class="p-4">
    <div class="flex">
      <n-h2>代理服务器</n-h2>
      <n-button
        class="mla"
        size="small"
        quaternary
        @click="handleAddProxySubButtonClick"
      >
        <template #icon>
          <n-icon :component="CloudDownload" />
        </template>
      </n-button>
    </div>
    <n-list bordered>
      <n-list-item
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
          <n-ellipsis> {{ proxy.name }}</n-ellipsis>
          <div>
            <n-tag type="success" size="small">
              {{ proxy.type }}
            </n-tag>
          </div>
        </div>
        <template #suffix>
          <div class="flex">
            <n-button quaternary size="small" disabled>
              <template #icon>
                <n-icon :component="Edit" />
              </template>
            </n-button>
            <n-button quaternary size="small">
              <template #icon>
                <n-icon :component="View" />
              </template>
            </n-button>
          </div>
        </template>
      </n-list-item>
    </n-list>
  </div>
  <n-modal
    v-model:show="showEditProxySub"
    class="w-100"
    preset="card"
    closable
    :title="proxySubFormTitle"
    size="small"
  >
    <n-form
      ref="proxySubForm"
      label-placement="left"
      size="small"
      :rules="proxySubFormRules"
      :model="subProxyData"
    >
      <n-form-item label="订阅" path="url">
        <n-input v-model:value="subProxyData.url" placeholder="订阅地址" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-radio-group v-model:value="subProxyData.type">
          <n-radio-button value="plain">
            PLAIN
          </n-radio-button>
          <n-radio-button label="BASE64" value="base64">
            BASE64
          </n-radio-button>
          <n-radio-button value="sip008">
            SIP008
          </n-radio-button>
          <n-radio-button value="clash">
            CLASH
          </n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="更新" path="period">
        <n-input-number
          v-model:value="subProxyData.period"
          placeholder="更新周期；[10, 10000]"
          :min="10"
          :max="10000"
        >
          <template #suffix>
            分钟
          </template>
        </n-input-number>
      </n-form-item>
    </n-form>
    <template #action>
      <div class="flex">
        <n-button class="ml-a" @click="handleProxySubCancelButtonClick">
          取消
        </n-button>
        <n-button class="ml-4" type="primary" @click="handleProxySubSaveButtonClick">
          保存
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import {
  NButton, NEllipsis, NForm, NFormItem, NH2, NIcon, NInput, NInputNumber, NList, NListItem,
  NModal, NRadioButton, NRadioGroup, NTag,
} from 'naive-ui'
import { CloudDownload, Edit, View } from '@vicons/carbon'
import { ref } from 'vue'
import type { ClashSettingSubscribe } from '@/share/type'
import { isSubScribeEqual } from '@/share/utils/setting'
import { proxy, proxyProvider, selectProxy } from '@/render/api/clash'
import type { Proxies, ProxyGroupInfo, ProxyInfo } from '@/share/type/clash/api'

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
    return proxy('Proxy')
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
