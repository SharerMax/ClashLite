<template>
  <!-- TODO 调整布局，头不动 -->

  <NLayout class="p-4">
    <div class="flex items-baseline">
      <NH2>
        规则配置
      </NH2>
      <div class="ml-a">
        <NButton
          quaternary
          size="small"
          type="primary"
          @click="handleRuleAddButtonClick"
        >
          <template #icon>
            <NIcon :component="Add" />
          </template>
          新增
        </NButton>
      </div>
    </div>

    <div>
      <NEmpty v-if="!ruleSetList.length" description="无规则" class="mt-20">
        <template #icon>
          <NIcon :component="Unknown" />
        </template>
      </NEmpty>
      <NList v-if="ruleSetList.length" bordered>
        <NListItem v-for="(ruleSet, index) in ruleSetList" :key="index" bordered>
          <template #prefix>
            <NText type="primary">
              {{ ruleSet.name }}
            </NText>
          </template>
          <NEllipsis>
            {{ ruleSet.url }}
          </NEllipsis>
          <NTag
            :bordered="false"
            size="small"
            type="success"
          >
            {{ ruleSet.behavior }}
          </NTag>
          <template #suffix>
            <NButton
              quaternary
              size="small"
              type="primary"
              @click="handleRuleSetDelete(ruleSet)"
            >
              <template #icon>
                <NIcon :component="Delete" />
              </template>
            </NButton>
          </template>
        </NListItem>
      </NList>
    </div>
  </NLayout>
  <NModal
    v-model:show="showEditModal"
    preset="card"
    :closable="true"
    class="w-100"
    title="新增规则集"
  >
    <NForm
      label-placement="left"
      label-width="auto"
      :model="editedRules"
      :rules="editRuleFormRules"
      size="small"
    >
      <NFormItem
        label="名称"
        path="name"
      >
        <NInput
          v-model:value="editedRules.name"
          placeholder="规则集名称"
        />
      </NFormItem>
      <NFormItem
        label="订阅"
        path="url"
      >
        <NInput
          v-model:value="editedRules.url"
          placeholder="订阅地址 URL"
        />
      </NFormItem>
      <NFormItem
        label="行为"
        path="behavior"
      >
        <NRadioGroup
          v-model:value="editedRules.behavior"
          size="small"
        >
          <NRadioButton
            label="域名"
            value="domain"
          />
          <NRadioButton
            label="IPCIDR"
            value="ipcidr"
          />
          <NRadioButton
            label="CLASSICAL"
            value="classical"
          />
        </NRadioGroup>
      </NFormItem>
      <NFormItem
        label="路由"
        path="type"
      >
        <NRadioGroup
          v-model:value="editedRules.type"
          size="small"
        >
          <NRadioButton
            label="直连"
            value="DIRECT"
          />
          <NRadioButton
            label="代理"
            value="PROXY"
          />
        </NRadioGroup>
      </NFormItem>
    </NForm>
    <template #action>
      <div class="flex">
        <NButton
          class="mla"
          @click="() => showEditModal = false"
        >
          取消
        </NButton>
        <NButton
          class="ml-4"
          type="primary"
          @click="handleRuleSaveButtonClick"
        >
          保存
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import {
  NButton, NEllipsis, NEmpty, NForm, NFormItem, NH2, NIcon, NInput,
  NLayout, NList, NListItem, NModal, NRadioButton, NRadioGroup, NTag,
  NText,
} from 'naive-ui'
import { Add, Delete, Unknown } from '@vicons/carbon'
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

function handleRuleSetDelete(value: ClashSettingRule) {
  window.clash.removeRuleSet(value.name)
  const removeIndex = ruleSetList.value.findIndex(ruleSet => maybeChangedRuleName === ruleSet.name)
  ruleSetList.value.splice(removeIndex, 1)
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
