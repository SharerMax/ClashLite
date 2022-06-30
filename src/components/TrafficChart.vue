<template>
  <Line
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

defineProps<Prop>()
Chart.register(LineElement, CategoryScale, LinearScale, PointElement)
interface Prop {
  chartData: TChartData<'line'>
}
const themeVars = useThemeVars()
console.log(themeVars.value)
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
