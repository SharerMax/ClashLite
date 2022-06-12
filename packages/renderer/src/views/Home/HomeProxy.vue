<template>
  <div class="flex">
    <n-h2>代理服务器</n-h2>
    <n-button
      class="mla"
      size="small"
      quaternary
      @click="handleAddProxySubButtonClick"
    >
      <template #icon>
        <n-icon :component="Add" />
      </template>
    </n-button>
  </div>
  <n-list bordered>
    <n-list-item>
      <template #prefix>
        <div class="w-16">
          美国
        </div>
      </template>
      <div class="flex flex-col">
        <span>127.0.0.1</span>
        <div>
          <n-tag
            type="success"
            size="small"
          >
            vmess
          </n-tag>
        </div>
      </div>
      <template #suffix>
        <div class="flex">
          <n-button
            quaternary
            size="small"
            disabled
          >
            <template #icon>
              <n-icon
                :component="Edit"
              />
            </template>
          </n-button>
          <n-button
            quaternary
            size="small"
          >
            <template #icon>
              <n-icon
                :component="View"
              />
            </template>
          </n-button>
        </div>
      </template>
    </n-list-item>
  </n-list>
  <n-modal
    class="w-100"
    preset="card"
    closable
    title="新增订阅"
    v-model:show="showEditRuleSub"
    size="small"
  >
    <n-form
      label-placement="left"
      size="small"
    >
      <n-form-item label="订阅">
        <n-input placeholder="订阅地址" />
      </n-form-item>
      <n-form-item label="类型">
        <n-radio-group>
          <n-radio-button
            label="PLAIN"
            value="plain"
          />
          <n-radio-button
            label="BASE64"
            value="base64"
          />
          <n-radio-button
            label="SIP008"
            value="sip008"
          />
          <n-radio-button
            label="CLASH"
            value="clash"
          />
        </n-radio-group>
      </n-form-item>
      <n-form-item label="更新">
        <n-input-number
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
        <n-button
          class="ml-a"
          @click="handleProxySubCancelButtonClick"
        >
          取消
        </n-button>
        <n-button
          class="ml-4"
          type="primary"
          @click="handleProxySubSaveButtonClick"
        >
          保存
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NH2, NList, NListItem, NTag, NIcon, NButton, NModal, NForm, NFormItem, NInput,
  NRadioGroup, NRadioButton, NInputNumber,
} from 'naive-ui'
import { Edit, View, Add } from '@vicons/carbon'
import { ref } from 'vue'

const showEditRuleSub = ref(false)
function handleAddProxySubButtonClick() {
  showEditRuleSub.value = true
}

function handleProxySubSaveButtonClick() {
  showEditRuleSub.value = false
}

function handleProxySubCancelButtonClick() {
  showEditRuleSub.value = false
}
</script>

<style scoped>

</style>
