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
    <div class="flex-1 overflow-hidden">
      <n-scrollbar>
        <n-card
          title="应用设置"
          class="mt-4"
        >
          <n-form :model="appSetting">
            <n-form-item
              label="App 自启"
              path="autoStartApp"
            >
              <n-switch v-model:value="appSetting.autoStartApp">
                <template #unchecked>
                  应用不随系统启动
                </template>
                <template #checked>
                  应用随系统启动
                </template>
              </n-switch>
            </n-form-item>
            <n-form-item label="Clash 自启">
              <n-switch>
                <template #checked>
                  Clash 随应用启动
                </template>
                <template #unchecked>
                  手动启动 Clash
                </template>
              </n-switch>
            </n-form-item>
            <n-form-item
              label="主题"
              path="themeStyle"
            >
              <n-radio-group v-model:value="appSetting.themeStyle">
                <n-radio-button value="system">
                  系统
                </n-radio-button>
                <n-radio-button value="dark">
                  暗色
                </n-radio-button>
                <n-radio-button value="light">
                  明亮
                </n-radio-button>
              </n-radio-group>
            </n-form-item>
          </n-form>
        </n-card>
        <n-card title="Clash 设置">
          <n-form
            :model="clashSettings"
            size="small"
            :rules="clashSettingsFormRule"
            :show-require-mark="false"
          >
            <n-form-item
              label="监听类型"
              path="listenType"
            >
              <n-radio-group v-model:value="clashSettings.listenType">
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
                v-model:value="clashSettings.listenProt"
                :min="1080"
                :max="65535"
              />
            </n-form-item>
            <n-form-item
              label="允许局域网访问"
              path="allowLan"
            >
              <n-switch
                v-model="clashSettings.allowLan"
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
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import {
  NButton, NCard, NForm, NFormItem, NH2, NIcon, NInputNumber, NRadioButton, NRadioGroup,
  NScrollbar, NSwitch,
} from 'naive-ui'
import { Save } from '@vicons/carbon'
import { ref } from 'vue'
import type { AppSetting, ClashSettings } from '../../../packages/share/type'

const clashSettings = ref<ClashSettings>({
  listenProt: 7890,
  listenType: 'mixed',
  allowLan: false,
  autoStart: true,
})

const clashSettingsFormRule: FormRules = {
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

const appSetting = ref<AppSetting>({
  autoStartApp: false,
  autoStartClash: true,
  themeStyle: 'dark',
})
</script>

<style scoped>

</style>
