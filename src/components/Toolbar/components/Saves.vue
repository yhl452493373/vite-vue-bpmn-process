<template>
  <n-button type="info" secondary="" @click="setupInfo"> 保存流程 </n-button>
  <n-modal v-model:show="modelVisible" preset="dialog" title="流程信息" :style="{ width: '640px' }">
    <n-form ref="formRef" :model="processInfo" :rules="rules" aria-modal="true">
      <n-form-item path="name" label="流程名称">
        <n-input v-model:value="processInfo.name" />
      </n-form-item>
      <n-form-item path="description" label="流程描述">
        <n-input v-model:value="processInfo.description" type="textarea" size="small" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button size="small" type="info" @click="saveProcess">确认</n-button>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import modeler from '@/store/modeler'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'SavesPanel',
    data: function () {
      return {
        processInfo: { name: '', description: '' },
        rules: {
          name: { required: true, message: '流程名称不能为空', trigger: ['blur', 'change'] }
        },
        modelVisible: false
      }
    },
    methods: {
      setupInfo() {
        this.modelVisible = true
      },
      async saveProcess() {
        const modelerStore = modeler()
        try {
          const modeler = modelerStore.getModeler

          if (!modeler) {
            return window.__messageBox.warning('模型加载失败，请刷新重试')
          }

          const { xml } = await modeler.saveXML({ format: true, preamble: true })

          console.log(this.processInfo)
          console.log(xml)
        } catch (e) {
          window.__messageBox.error((e as Error).message || (e as string))
        }
      }
    }
  })
</script>

<style scoped></style>
