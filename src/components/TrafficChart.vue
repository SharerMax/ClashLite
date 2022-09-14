<template>
  <Line
    ref="lineChartRef"
    :chart-data="chartData"
    :chart-options="chartOptions"
    :height="200"
    :width="1200"
  />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  CategoryScale, Chart, LineElement, LinearScale, PointElement,
} from 'chart.js'
import type { TChartData, TChartOptions } from 'vue-chartjs/dist/types'
import { useThemeVars } from 'naive-ui'
import 'chartjs-adapter-dayjs-3'
import ChartStreaming from 'chartjs-plugin-streaming'
import { ref } from 'vue'
// fixme: reactivity.esm-bundler.js:465 Uncaught RangeError: Maximum call stack size exceeded
defineProps<Prop>()
Chart.register(ChartStreaming, LineElement, CategoryScale, LinearScale, PointElement)
interface Prop {
  chartData: TChartData<'line'>
}
// const lineChartRef = ref<typeof Line | null>(null)
// function updateTrafficData(trafficData: { upload: number; download: number }) {
//   const chartComponent = lineChartRef.value
//   if (chartComponent) {
//     const chart = chartComponent.chart as Chart<'line'>
//     const currentTime = Date.now()
//     chart.data.datasets.forEach((dataSet) => {
//       dataSet.data.push({
//         x: currentTime,
//         y: trafficData.upload,
//       })
//     })
//     chart.update()
//   }
// }
// defineExpose({
//   updateTrafficData,
// })
const themeVars = useThemeVars()
const chartOptions: TChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  backgroundColor: 'blue',
  borderColor: themeVars.value.primaryColor,
  elements: {
    line: {
      tension: 0.4,
    },
  },
  scales: {
    x: {
      type: 'realtime',
      realtime: {
        duration: 20000,
        delay: 1000,
      },
      grid: {
        color: themeVars.value.borderColor,
      },
    },
    y: {
      grid: {
        color: themeVars.value.borderColor,
      },
      min: 0,
    },
  },

}
</script>

<style scoped>

</style>
