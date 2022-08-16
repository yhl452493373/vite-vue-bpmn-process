import { defineComponent, computed, ref, onMounted } from 'vue'
import Toolbar from '@/components/Toolbar'
import Palette from '@/components/Palette'
import Designer from '@/components/Designer'
import Panel from '@/components/Panel'
import ContextMenu from '@/components/ContextMenu/index.vue'
import { EditorSettings } from 'types/editor/settings'
import { defaultSettings } from '@/config'

import { Base64 } from 'js-base64'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import { NConfigProvider, NDialogProvider, NMessageProvider, zhCN, dateZhCN } from 'naive-ui'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)

const App = defineComponent({
  setup() {
    const editorSettings = ref<EditorSettings>({ ...defaultSettings })

    const processId = ref<string>(sessionStorage.getItem('processId') || '')
    const processName = ref<string>(sessionStorage.getItem('processName') || '')
    const processDescription = ref<string>(sessionStorage.getItem('processDescription') || '')
    const processContent = ref<string>(sessionStorage.getItem('processContent') || '')

    const processXml = ref<string>(Base64.decode(processContent.value))

    const customPalette = computed<boolean>(() => editorSettings.value.paletteMode === 'custom')
    const customPenal = computed<boolean>(() => editorSettings.value.penalMode === 'custom')
    const showToolbar = computed<boolean>(() => editorSettings.value.toolbar)

    const computedClasses = computed<string>(() => {
      const baseClass = ['designer-container']
      customPalette.value && baseClass.push('designer-with-palette')
      customPenal.value && baseClass.push('designer-with-penal')
      editorSettings.value.bg === 'grid-image' && baseClass.push('designer-with-bg')
      editorSettings.value.bg === 'image' && baseClass.push('designer-with-image')

      return baseClass.join(' ')
    })

    onMounted(() => {
      document.body.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()
      })
    })

    /* 组件渲染 */
    return () => (
      <NConfigProvider
        abstract
        locale={zhCN}
        dateLocale={dateZhCN}
        componentOptions={{ DynamicInput: { buttonSize: 'small' } }}
        hljs={hljs}
      >
        <NDialogProvider>
          <div class={computedClasses.value} id="designer-container">
            <NMessageProvider>
              {showToolbar.value && (
                <Toolbar
                  v-model:processId={processId.value}
                  v-model:processName={processName.value}
                  v-model:processDescription={processDescription.value}
                ></Toolbar>
              )}
              <div class="main-content">
                {customPalette.value && <Palette></Palette>}
                <Designer v-model:xml={processXml.value}></Designer>
                {customPenal.value ? (
                  <Panel></Panel>
                ) : (
                  <div class="camunda-penal" id="camunda-penal"></div>
                )}
              </div>
              <ContextMenu></ContextMenu>
            </NMessageProvider>
          </div>
        </NDialogProvider>
      </NConfigProvider>
    )
  }
})

export default App
