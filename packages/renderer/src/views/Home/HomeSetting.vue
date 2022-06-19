<template>
  <div class="p-4 flex flex-col h-screen box-border">
    <div class="flex flex-none">
      <n-h2>设置</n-h2>
      <n-button
        class="ml-a"
        quaternary
        size="small"
        type="primary"
      >
        <template #icon>
          <n-icon :component="Save" />
        </template>
        应用
      </n-button>
    </div>
    <div class="flex-1 overview-hidden">
      <n-card>
        <n-form
          :model="settings"
          size="small"
          :rules="settingsFormRule"
        >
          <n-form-item
            label="监听类型"
            path="listenType"
          >
            <n-radio-group v-model:value="settings.listenType">
              <n-radio-button value="mixed">
                BOTH
              </n-radio-button>
              <n-radio-button value="http">
                HTTP(S)
              </n-radio-button>
              <n-radio-button value="socks5">
                SOCKS5
              </n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item
            label="监听端口"
            path="listenProt"
          >
            <n-input-number
              v-model:value="settings.listenProt"
              :min="1080"
              :max="65535"
            />
          </n-form-item>
          <n-form-item
            label="允许局域网访问"
            path="allowLan"
          >
            <n-switch
              v-model="settings.allowLan"
              :round="false"
            >
              <template #unchecked>
                仅本机访问
              </template>
              <template #checked>
                允许局域网访问
              </template>
            </n-switch>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
    {{ settings.listenProt }}
  </div>
</template>

<script setup lang="ts">
import {
  NH2, NButton, NIcon, NCard, NForm, NFormItem, NInputNumber, NRadioGroup, NRadioButton, FormRules,
  NSwitch,
} from 'naive-ui'
import { Save } from '@vicons/carbon'
import { ref } from 'vue'

type Settings = {
  listenProt: number,
  listenType: 'http' | 'socks5' | 'mixed',
  allowLan: boolean
}
const settings = ref<Settings>({
  listenProt: 7890,
  listenType: 'mixed',
  allowLan: false,

})

const settingsFormRule: FormRules = {
  listenType: {
    required: true,
  },
  listenProt: [
    {
      required: true,
      type: 'integer',
      min: 1080,
      max: 65535,
      message: '请输入正确的端口号(1080-65535)',
      trigger: 'input',
    },
  ],
  allowLan: {
    required: true,
    type: 'boolean',
  },
}

</script>

<style scoped>

</style>
