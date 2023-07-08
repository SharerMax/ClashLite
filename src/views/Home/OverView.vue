<template>
  <div class="h-full">
    <NScrollbar trigger="hover">
      <NGrid
        cols="1 780:2"
        x-gap="10"
        y-gap="10"
        class="p-4 box-border"
      >
        <NGridItem>
          <NCard embedded title="运行">
            <NSpace vertical :size="12">
              <div>
                <label class="w-24 inline-block">运行状态：</label>
                <NSwitch
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
                </NSwitch>
              </div>
              <div>
                <label class="w-24 inline-block">运行模式：</label>
                <NRadioGroup
                  :value="activatedRunMode"
                  size="small"
                  :disabled="!clashRunning"
                  @update:value="handleRunModeChange"
                >
                  <NRadioButton
                    v-for="(model, index) in runModels"
                    :key="index"
                    :label="model.label"
                    :value="model.value"
                  />
                </NRadioGroup>
              </div>
              <div class="flex items-center">
                <label class="w-24 inline-block">本地IP：</label>
                <NText class="mr-0.5 " type="primary" code>
                  {{ localIP }}
                </NText>
                <NButton
                  quaternary
                  size="small"
                  :focusable="false"
                  @click="handleClipboardCopy(localIP)"
                >
                  <template #icon>
                    <NIcon :component="Copy" />
                  </template>
                </NButton>
              </div>
              <div class="flex items-center">
                <label class="w-24 inline-block">SOCKS代理：</label>
                <NText class="mr-0.5 " type="primary" code>
                  socks5://{{ localIP }}:7890
                </NText>
                <NButton
                  quaternary
                  size="small"
                  :focusable="false"
                  @click="handleClipboardCopy('socks5://{{localIP}}:7890')"
                >
                  <template #icon>
                    <NIcon :component="Copy" />
                  </template>
                </NButton>
              </div>
              <div class="flex items-center ">
                <label class="w-24 inline-block">HTTP代理：</label>
                <NText class="mr-0.5 " type="primary" code>
                  http://{{ localIP }}:7890
                </NText>
                <NButton
                  quaternary
                  size="small"
                  :focusable="false"
                  @click="handleClipboardCopy('http://{{localIP}}:7890')"
                >
                  <template #icon>
                    <NIcon :component="Copy" />
                  </template>
                </NButton>
              </div>
            </NSpace>
          </NCard>
        </NGridItem>
        <NGridItem>
          <NCard embedded title="访问检测" class="h-full">
            <NEmpty description="Coming Soon" />
          </NCard>
        </NGridItem>
        <NGridItem span="1 780:2">
          <TrafficChart />
        </NGridItem>
      </NGrid>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  NButton, NCard, NEmpty, NGrid, NGridItem, NIcon, NRadioButton, NRadioGroup,
  NScrollbar, NSpace, NSwitch, NText, useDialog, useMessage,
} from 'naive-ui'
import { Copy } from '@vicons/carbon'
import { onMounted, onUnmounted, ref } from 'vue'
import TrafficChart from '@/render/components/TrafficChart.vue'
import { baseConfig, patchBaseConfig } from '@/render/api/clash'
import { checkClashHealth } from '@/render/utils/clash'

const clashProcessLoading = ref(false)
const clashRunning = ref(window.clash.clashIsRunning())
const dialog = useDialog()
const defaultRunMode = window.clash.getRunMode()
async function handleClashRunChange(value: boolean) {
  try {
    if (value) {
      clashProcessLoading.value = true
      clashRunning.value = await window.clash.start()
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
  catch (error) {
    dialog.error({
      content: `错误 [ ${error} ]`,
      positiveText: '知道了',
    })
    clashProcessLoading.value = false
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

function generateLabels() {
  const labels = Array(60).fill('0')
  for (let i = 0; i < 60; i++) {
    labels[i] = (i + 1).toString()
  }

  return labels
}

const uploadData: { x: number; y: number }[] = []
const downloadData: { x: number; y: number }[] = []
function getRandomInt(max: number) {
  return Math.abs(Math.floor(Math.random() * max))
}
let timer = -1
onMounted(() => {
  timer = window.setInterval(() => {
    if (uploadData.length > 60) {
      uploadData.shift()
    }
    const currentTime = Date.now()
    uploadData.push({ x: currentTime, y: getRandomInt(4096) })

    if (downloadData.length > 60) {
      downloadData.shift()
    }
    downloadData.push({ x: currentTime, y: getRandomInt(4096) })
  }, 1000)
})
onUnmounted(() => {
  window.clearInterval(timer)
})

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
