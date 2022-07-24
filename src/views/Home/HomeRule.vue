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
      <n-empty v-if="!ruleSetList.length" description="无规则" class="mt-20">
        <template #icon>
          <n-icon :component="Unknown" />
        </template>
      </n-empty>
      <n-list v-if="ruleSetList.length" bordered>
        <n-list-item v-for="(ruleSet, index) in ruleSetList" :key="index" bordered>
          <template #prefix>
            <n-text type="primary">
              {{ ruleSet.name }}
            </n-text>
          </template>
          <n-ellipsis>
            {{ ruleSet.url }}
          </n-ellipsis>
          <template #suffix>
            <n-tag
              :bordered="false"
              size="small"
              type="success"
            >
              {{ ruleSet.behavior }}
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
      :model="editedRules"
      :rules="editRuleFormRules"
      size="small"
    >
      <n-form-item
        label="名称"
        path="name"
      >
        <n-input
          v-model:value="editedRules.name"
          placeholder="规则集名称"
        />
      </n-form-item>
      <n-form-item
        label="订阅"
        path="url"
      >
        <n-input
          v-model:value="editedRules.url"
          placeholder="订阅地址 URL"
        />
      </n-form-item>
      <n-form-item
        label="行为"
        path="behavior"
      >
        <n-radio-group
          v-model:value="editedRules.behavior"
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
          v-model:value="editedRules.type"
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
  NButton, NEllipsis, NEmpty, NForm, NFormItem, NH2, NIcon, NInput,
  NLayout, NList, NListItem, NModal, NRadioButton, NRadioGroup, NTag,
  NText,
} from 'naive-ui'
import { Add, Unknown } from '@vicons/carbon'
import { ref } from 'vue'
import type { ClashSettingRule } from '@/share/type'

const ruleSetList = ref<ClashSettingRule[]>([])
ruleSetList.value = window.clash.getRuleSet()

type EditType = 'add' | 'edit'
const editType: EditType = 'add'
const maybeChangedRuleName = ''
const showEditModal = ref(false)
const editedRules = ref<ClashSettingRule>({
  name: '',
  url: '',
  type: 'DIRECT',
  behavior: 'domain',
})

function handleRuleAddButtonClick() {
  showEditModal.value = true
}

function handleRuleSaveButtonClick() {
  if (editType === 'add') {
    window.clash.addRuleSet({ ...editedRules.value })
    ruleSetList.value.push({ ...editedRules.value })
  }
  else if (editType === 'edit') {
    if (maybeChangedRuleName) {
      window.clash.changeRuleSet(maybeChangedRuleName, { ...editedRules.value })
      const replaceIndex = ruleSetList.value.findIndex(ruleSet => maybeChangedRuleName === ruleSet.name)
      ruleSetList.value.splice(replaceIndex, 1, { ...editedRules.value })
    }
  }
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
