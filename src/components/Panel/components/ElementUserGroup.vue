<template>
  <n-collapse-item name="user-assign">
    <template #header>
      <collapse-title title="人员设置">
        <lucide-icon name="User" />
      </collapse-title>
    </template>

    <edit-item label="处理人" :label-width="80">
      <n-select
        v-model:value="userId"
        :options="userOptions"
        filterable
        tag
        @update:value="updateAssignee"
      />
    </edit-item>

    <edit-item label="候选人" :label-width="80">
      <n-select
        v-model:value="candidateUserIds"
        filterable
        tag
        multiple
        :options="candidateUserOptions"
        @update:value="updateCandidateUsers"
      />
    </edit-item>
  </n-collapse-item>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref, UnwrapRef } from 'vue'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import {
    getAssignee,
    setAssignee,
    getCandidateUsers,
    setCandidateUsers
  } from '@/bo-utils/userGroupUtil'

  export default defineComponent({
    name: 'ElementUserGroup',
    data() {
      const userId: Ref<UnwrapRef<null | string>> = ref(null)
      const candidateUserIds: Ref<UnwrapRef<null | string[]>> = ref(null)
      const userOptions = [
        { label: '张三', value: 'zs' },
        { label: '李四', value: 'ls' }
      ]
      const candidateUserOptions = [
        { label: '王五', value: 'ww' },
        { label: '周六', value: 'zl' }
      ]
      return {
        userId,
        userOptions,
        candidateUserIds,
        candidateUserOptions
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    mounted() {
      this.reloadUserGroupData()
      EventEmitter.on('element-update', this.reloadUserGroupData)
    },
    methods: {
      reloadUserGroupData() {
        this.userId = getAssignee(this.getActive as Base)
        this.candidateUserIds = getCandidateUsers(this.getActive as Base)
      },
      updateAssignee(value) {
        setAssignee(this.getActive as Base, value)
      },
      updateCandidateUsers(value) {
        setCandidateUsers(this.getActive as Base, value)
      }
    }
  })
</script>
