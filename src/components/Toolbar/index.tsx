import { defineComponent, PropType, toRefs } from 'vue'
import { NButtonGroup } from 'naive-ui'
import Imports from '@/components/Toolbar/components/Imports'
import Exports from '@/components/Toolbar/components/Exports'
import Previews from '@/components/Toolbar/components/Previews'
import Saves from '@/components/Toolbar/components/Saves.vue'
import Aligns from '@/components/Toolbar/components/Aligns'
import Scales from '@/components/Toolbar/components/Scales'
import Commands from '@/components/Toolbar/components/Commands'
import ExternalTools from '@/components/Toolbar/components/ExternalTools'

const Toolbar = defineComponent({
  name: 'ToolBar',
  props: {
    processId: {
      type: String as PropType<string>,
      default: undefined
    },
    processName: {
      type: String as PropType<string>,
      default: undefined
    },
    processDescription: {
      type: String as PropType<string>,
      default: undefined
    }
  },
  emits: ['update:processId', 'update:processName', 'update:processDescription'],
  setup(props) {
    const { processId, processName, processDescription } = toRefs(props)

    return () => (
      <div class="toolbar">
        <NButtonGroup>
          <Imports></Imports>
          <Exports></Exports>
          <Previews></Previews>
          <Saves
            v-model:processId={processId.value}
            v-model:processName={processName.value}
            v-model:processDescription={processDescription.value}
          ></Saves>
        </NButtonGroup>
        <Aligns></Aligns>
        <Scales></Scales>
        <Commands></Commands>
        <ExternalTools></ExternalTools>
      </div>
    )
  }
})

export default Toolbar
