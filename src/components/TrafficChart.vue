<template>
  <div>
    <VChart :option="chartOption" autoresize class="w-full h-80" />
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import type { EChartsOption } from 'echarts/types/dist/shared'
use([CanvasRenderer, LineChart, GridComponent])
const chartOption: EChartsOption = {
  xAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5'],
  },
  yAxis: {
    type: 'value',
  },
  grid: {
    left: 60,
    right: 0,
  },
  series: [
    {
      data: [23, 34, 13, 98, 23],
      type: 'line',
    },
  ],
}
</script>

<style scoped>

</style>
