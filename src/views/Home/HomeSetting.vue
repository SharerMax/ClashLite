<template>
  <div class="p-4 flex flex-col h-screen box-border">
    <div class="flex flex-none">
      <NH2>设置</NH2>
      <NButton
        class="ml-a"
        quaternary
        size="small"
        type="primary"
      >
        <template #icon>
          <NIcon :component="Save" />
        </template>
        应用
      </NButton>
    </div>
    <div class="flex-1 overflow-hidden">
      <NScrollbar>
        <NCard
          title="应用设置"
          class="mt-4"
        >
          <NForm :model="appSetting">
            <NFormItem
              label="App 自启"
              path="autoStartApp"
            >
              <NSwitch v-model:value="appSetting.autoStartApp">
                <template #unchecked>
                  应用不随系统启动
                </template>
                <template #checked>
                  应用随系统启动
                </template>
              </NSwitch>
            </NFormItem>
            <NFormItem label="Clash 自启">
              <NSwitch>
                <template #checked>
                  Clash 随应用启动
                </template>
                <template #unchecked>
                  手动启动 Clash
                </template>
              </NSwitch>
            </NFormItem>
            <NFormItem
              label="主题"
              path="themeStyle"
            >
              <NRadioGroup v-model:value="appSetting.themeStyle">
                <NRadioButton value="system">
                  系统
                </NRadioButton>
                <NRadioButton value="dark">
                  暗色
                </NRadioButton>
                <NRadioButton value="light">
                  明亮
                </NRadioButton>
              </NRadioGroup>
            </NFormItem>
          </NForm>
        </NCard>
        <NCard title="Clash 设置">
          <NForm
            :model="clashSettings"
            size="small"
            :rules="clashSettingsFormRule"
            :show-require-mark="false"
          >
            <NFormItem
              label="监听类型"
              path="listenType"
            >
              <NRadioGroup v-model:value="clashSettings.listenType">
                <NRadioButton value="mixed">
                  BOTH
                </NRadioButton>
                <NRadioButton value="http">
                  HTTP(S)
                </NRadioButton>
                <NRadioButton value="socks5">
                  SOCKS5
                </NRadioButton>
              </NRadioGroup>
            </NFormItem>
            <NFormItem
              label="监听端口"
              path="listenProt"
            >
              <NInputNumber
                v-model:value="clashSettings.listenProt"
                :min="1080"
                :max="65535"
              />
            </NFormItem>
            <NFormItem
              label="允许局域网访问"
              path="allowLan"
            >
              <NSwitch
                v-model="clashSettings.allowLan"
                :round="false"
              >
                <template #unchecked>
                  仅本机访问
                </template>
                <template #checked>
                  允许局域网访问
                </template>
              </NSwitch>
            </NFormItem>
          </NForm>
        </NCard>
      </NScrollbar>
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
import type { AppSetting, ClashSettings } from 'share/dist/type'

const clashSettings = ref<Pick<ClashSettings, 'listenProt' | 'allowLan' | 'listenType' | 'autoStart'>>({
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
