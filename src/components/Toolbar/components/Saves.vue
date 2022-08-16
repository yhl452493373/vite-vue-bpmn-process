<template>
  <n-button type="info" secondary="" @click="setupInfo"> 保存流程 </n-button>
  <n-modal
    v-model:show="modelVisible"
    :mask-closable="false"
    preset="dialog"
    title="流程信息"
    :style="{ width: '500px' }"
    @close="close"
  >
    <n-form ref="formRef" :model="processInfo" :rules="rules" aria-modal="true">
      <n-form-item path="name" label="流程名称">
        <n-input v-model:value="processInfo.name" />
      </n-form-item>
      <n-form-item path="description" label="流程描述">
        <n-input v-model:value="processInfo.description" type="textarea" size="small" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button v-model:loading="saving" size="small" type="info" @click="saveProcess"
        >确认</n-button
      >
    </template>
  </n-modal>
</template>

<script lang="ts">
  import modeler from '@/store/modeler'
  import { defineComponent, PropType, ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import axios from 'axios'

  export default defineComponent({
    name: 'SavesPanel',
    props: {
      processId: {
        type: String as PropType<string>,
        default: ''
      },
      processName: {
        type: String as PropType<string>,
        default: ''
      },
      processDescription: {
        type: String as PropType<string>,
        default: ''
      }
    },
    setup: function (props) {
      const message = useMessage()
      return {
        success(msg, onAfterLeave?) {
          message.success(msg, {
            onAfterLeave,
            duration: 2000
          })
        },
        error(msg, onAfterLeave?) {
          message.error(msg, {
            onAfterLeave,
            duration: 2000
          })
        }
      }
    },
    data: function () {
      return {
        processInfo: {
          id: this.processId,
          name: this.processName,
          description: this.processDescription
        },
        rules: {
          name: { required: true, message: '流程名称不能为空', trigger: ['blur', 'change'] }
        },
        modelVisible: false,
        saving: false
      }
    },
    methods: {
      setupInfo() {
        this.modelVisible = true
      },
      async saveProcess() {
        this.saving = true
        const modelerStore = modeler()
        try {
          const modeler = modelerStore.getModeler

          if (!modeler) {
            return window.__messageBox.warning('模型加载失败，请刷新重试')
          }

          const { xml } = await modeler.saveXML({ format: true, preamble: true })
          const { svg } = await modeler.saveSVG()
          const { id, name, description } = this.processInfo

          const url =
            ref(id).value === ''
              ? '/cemis/lcsj/process-resources/insert'
              : '/cemis/lcsj/process-resources/update'

          const method = ref(id).value === '' ? 'post' : 'put'

          const formData = new FormData()

          formData.append('id', id)
          formData.append('name', name)
          formData.append('description', description)
          formData.append('content', xml === undefined ? '' : xml)
          formData.append('contentSvg', svg === undefined ? '' : svg)

          axios[method](url, formData).then((res) => {
            this.saving = false
            if (res.data.status === 'success') {
              this.success('保存成功', () => {
                this.modelVisible = false
                if (parent.hasOwnProperty('closeDesignerDialog')) {
                  parent['closeDesignerDialog']()
                }
              })
            } else {
              this.error('保存失败')
            }
          })
        } catch (e) {
          window.__messageBox.error((e as Error).message || (e as string))
        }
      },
      close() {
        return !this.saving
      }
    }
  })
</script>

<style scoped></style>
