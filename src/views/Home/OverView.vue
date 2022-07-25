<template>
  <div class="h-full">
    <n-scrollbar trigger="hover">
      <n-grid
        cols="1 780:2"
        x-gap="10"
        y-gap="10"
        class="p-4 box-border"
      >
        <n-grid-item>
          <n-card embedded title="运行">
            <n-space vertical :size="12">
              <div>
                <label class="w-24 inline-block">运行状态：</label>
                <n-switch
                  size="medium"
                  :loading="clashProcessLoading"
                  :value="clashRunning"
                  @update:value="handleClashRunChange"
                >
                  <template #checked>
                    运行中
                  </template>
                  <template #unchecked>
                    已停止
                  </template>
                </n-switch>
              </div>
              <div>
                <label class="w-24 inline-block">运行模式：</label>
                <n-radio-group
                  :value="activatedRunMode"
                  size="small"
                  :disabled="!clashRunning"
                  @update:value="handleRunModeChange"
                >
                  <n-radio-button
                    v-for="(model, index) in runModels"
                    :key="index"
                    :label="model.label"
                    :value="model.value"
                  />
                </n-radio-group>
              </div>
              <div class="flex items-center">
                <label class="w-24 inline-block">本地IP：</label>
                <n-text class="mr-0.5 " type="primary" code>
                  {{ localIP }}
                </n-text>
                <n-button
                  quaternary
                  size="small"
                  :focusable="false"
                  @click="handleClipboardCopy(localIP)"
                >
                  <template #icon>
                    <n-icon :component="Copy" />
                  </template>
                </n-button>
              </div>
              <div class="flex items-center">
                <label class="w-24 inline-block">SOCKS代理：</label>
                <n-text class="mr-0.5 " type="primary" code>
                  socks5://{{ localIP }}:7890
                </n-text>
                <n-button
                  quaternary
                  size="small"
                  :focusable="false"
                  @click="handleClipboardCopy('socks5://{{localIP}}:7890')"
                >
                  <template #icon>
                    <n-icon :component="Copy" />
                  </template>
                </n-button>
              </div>
              <div class="flex items-center ">
                <label class="w-24 inline-block">HTTP代理：</label>
                <n-text class="mr-0.5 " type="primary" code>
                  http://{{ localIP }}:7890
                </n-text>
                <n-button
                  quaternary
                  size="small"
                  :focusable="false"
                  @click="handleClipboardCopy('http://{{localIP}}:7890')"
                >
                  <template #icon>
                    <n-icon :component="Copy" />
                  </template>
                </n-button>
              </div>
            </n-space>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card embedded title="访问检测" class="h-full">
            <n-empty description="Coming Soon" />
          </n-card>
        </n-grid-item>
        <n-grid-item span="1 780:2">
          <!-- <Line :chart-data="chartData" /> -->
          <!-- <div class="h-150" /> -->
          <traffic-chart :chart-data="chartData" />
        </n-grid-item>
      </n-grid>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  NButton, NCard, NEmpty, NGrid, NGridItem, NIcon, NRadioButton, NRadioGroup,
  NScrollbar, NSpace, NSwitch, NText, useDialog, useMessage,
} from 'naive-ui'
import { Copy } from '@vicons/carbon'
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue'
import type { TChartData } from 'vue-chartjs/dist/types'
import TrafficChart from '../../components/TrafficChart.vue'
import { baseConfig, patchBaseConfig } from '@/render/api/clash'
import { checkClashHealth } from '@/render/utils/clash'

const clashProcessLoading = ref(false)
const clashRunning = ref(false)
const dialog = useDialog()
const defaultRunMode = window.clash.getRunMode()
async function handleClashRunChange(value: boolean) {
  if (value) {
    clashProcessLoading.value = true
    clashRunning.value = !!await window.clash.start()
    clashProcessLoading.value = false
    setTimeout(() => {
      baseConfig().then((res) => {
        if (!checkClashHealth(res.data)) {
          dialog.error({
            content: '端口冲突，请检查本地代理端口是否被占用',
            positiveText: '知道了',
          })
          handleClashRunChange(false)
        }
        else {
          handleRunModeChange(defaultRunMode)
        }
      })
    }, 1500)
  }
  else {
    clashRunning.value = false
    window.clash.stop()
  }
}

const message = useMessage()
function handleClipboardCopy(text: string) {
  window.copyTextToClipboard(text)
  message.success('Copy Success')
}

interface RunMode {
  label: string
  value: 'direct' | 'rule' | 'global'
}

const runModels: RunMode[] = [{
  label: '直连',
  value: 'direct',
}, {
  label: '规则',
  value: 'rule',
}, {
  label: '全局',
  value: 'global',
}]

const activatedRunMode = ref<RunMode['value']>(defaultRunMode)

function handleRunModeChange(mode: RunMode['value']) {
  patchBaseConfig({ mode }).then(() => {
    activatedRunMode.value = mode
    window.clash.saveRunMode(mode)
  })
}

const generateLabels = () => {
  const labels = Array(60).fill('0')
  for (let i = 0; i < 60; i++) {
    labels[i] = (i + 1).toString()
  }

  return labels
}

const uploadData = ref(Array(60).fill(0))
const downloadData = ref(Array(60).fill(0))

function getRandomInt(max: number) {
  return Math.abs(Math.floor(Math.random() * max))
}
let timer = -1
onMounted(() => {
  timer = window.setInterval(() => {
    const newUploadData = Array.from(uploadData.value)
    newUploadData.shift()
    newUploadData.push(getRandomInt(4096))
    uploadData.value = newUploadData
    const newDownloadData = Array.from(downloadData.value)
    newDownloadData.shift()
    newDownloadData.push(getRandomInt(4096))
    downloadData.value = newDownloadData
  }, 1000)
})
onUnmounted(() => {
  window.clearInterval(timer)
})
const chartData = computed <TChartData<'line'>>(() => ({
  datasets: [{
    data: uploadData.value,
  }, {
    data: downloadData.value,
    borderColor: 'red',
  }],
  labels: generateLabels(),
}))

const localIP = ref('127.0.0.1')
onMounted(() => {
  window.localIPv4().then((ipv4) => {
    if (ipv4) {
      localIP.value = ipv4
    }
  },
  )
})

// const chartData: TChartData<'line'> = {
//   datasets: [{
//     data: uploadData.value,
//   }, {
//     data: downloadData.value,
//     borderColor: 'red',
//   }],
//   labels: generateLabels(),
// }
</script>

<style scoped>

</style>
