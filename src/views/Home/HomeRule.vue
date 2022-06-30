<template>
  <!-- TODO 调整布局，头不动 -->

  <n-layout class="p-4">
    <div class="flex items-baseline">
      <n-h2>
        规则配置
      </n-h2>
      <div class="ml-a">
        <n-button
          quaternary
          size="small"
          type="primary"
          @click="handleRuleAddButtonClick"
        >
          <template #icon>
            <n-icon :component="Add" />
          </template>
          新增
        </n-button>
      </div>
    </div>

    <div>
      <n-list bordered>
        <n-list-item bordered>
          <template #prefix>
            <n-text type="primary">
              ProxyList
            </n-text>
          </template>
          <n-ellipsis>
            https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="success"
            >
              PROXY
            </n-tag>
          </template>
        </n-list-item>
        <n-list-item bordered>
          <template #prefix>
            <n-text type="primary">
              Google
            </n-text>
          </template>
          <n-ellipsis>
            https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="success"
            >
              PROXY
            </n-tag>
          </template>
        </n-list-item>
        <n-list-item bordered>
          <template #prefix>
            <n-text type="primary">
              CN:SITE
            </n-text>
          </template>
          <n-ellipsis>
            https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="info"
            >
              DIRECT
            </n-tag>
          </template>
        </n-list-item>
      </n-list>
    </div>
  </n-layout>
  <n-modal
    v-model:show="showEditModal"
    preset="card"
    :closable="true"
    class="w-100"
    title="新增规则集"
  >
    <n-form
      label-placement="left"
      label-width="auto"
      :model="editRules"
      :rules="editRuleFormRules"
      size="small"
    >
      <n-form-item
        label="名称"
        path="name"
      >
        <n-input
          v-model:value="editRules.name"
          placeholder="规则集名称"
        />
      </n-form-item>
      <n-form-item
        label="订阅"
        path="url"
      >
        <n-input
          v-model:value="editRules.url"
          placeholder="订阅地址 URL"
        />
      </n-form-item>
      <n-form-item
        label="行为"
        path="behavior"
      >
        <n-radio-group
          v-model:value="editRules.behavior"
          size="small"
        >
          <n-radio-button
            label="域名"
            value="domain"
          />
          <n-radio-button
            label="IPCIDR"
            value="ipcidr"
          />
          <n-radio-button
            label="CLASSICAL"
            value="classical"
          />
        </n-radio-group>
      </n-form-item>
      <n-form-item
        label="路由"
        path="type"
      >
        <n-radio-group
          v-model:value="editRules.type"
          size="small"
        >
          <n-radio-button
            label="直连"
            value="DIRECT"
          />
          <n-radio-button
            label="代理"
            value="PROXY"
          />
        </n-radio-group>
      </n-form-item>
    </n-form>
    <template #action>
      <div class="flex">
        <n-button
          class="mla"
          @click="() => showEditModal = false"
        >
          取消
        </n-button>
        <n-button
          class="ml-4"
          type="primary"
          @click="handleRuleSaveButtonClick"
        >
          保存
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import {
  NButton, NEllipsis, NForm, NFormItem, NH2, NIcon, NInput, NLayout,
  NList, NListItem, NModal, NRadioButton, NRadioGroup, NTag, NText,
} from 'naive-ui'
import { Add } from '@vicons/carbon'
import { ref } from 'vue'

const showEditModal = ref(false)
const editRules = ref({
  name: null,
  url: null,
  type: 'DIRECT',
  behavior: 'domain',
})
function handleRuleAddButtonClick() {
  showEditModal.value = true
}
function handleRuleSaveButtonClick() {
  showEditModal.value = false
}
const editRuleFormRules: FormRules = {
  name: [{
    required: true,
    message: '请输入规则集名称',
    trigger: 'blur',
  }],
  url: [
    {
      required: true,
      message: '请输入正确的 URL',
      trigger: 'blur',
      type: 'url',
    },
  ],
  type: [
    {
      required: true,
    },
  ],
  behavior: [
    { required: true },
  ],
}
</script>

<style scoped>
:deep(.n-list-item__main) {
  overflow: hidden;
}
</style>
