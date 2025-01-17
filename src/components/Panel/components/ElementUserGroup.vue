<template>
  <n-collapse-item name="user-assign">
    <template #header>
      <collapse-title title="人员设置">
        <lucide-icon name="User" />
      </collapse-title>
    </template>

    <edit-item label="处理人" :label-width="80">
      <n-select
        :loading="userOptionsLoading"
        :value="userId"
        :options="userOptions"
        filterable
        tag
        @update:value="updateAssignee"
      />
    </edit-item>

    <edit-item label="候选人" :label-width="80">
      <n-select
        :loading="candidateUserOptionsLoading"
        :value="candidateUserIds"
        filterable
        tag
        multiple
        :options="candidateUserOptions"
        @update:value="updateCandidateUsers"
      />
    </edit-item>
    <edit-item label="候选组" :label-width="80">
      <n-select
        :loading="candidateGroupsOptionsLoading"
        :value="candidateGroups"
        filterable
        tag
        multiple
        :options="candidateGroupsOptions"
        @update:value="updateCandidateGroups"
      />
    </edit-item>
  </n-collapse-item>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
  import { mapState } from 'pinia'
  import axios from 'axios'
  import modelerStore from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import {
    getAssignee,
    setAssignee,
    getCandidateUsers,
    setCandidateUsers,
    getCandidateGroups,
    setCandidateGroups
  } from '@/bo-utils/userGroupUtil'

  export default defineComponent({
    name: 'ElementUserGroup',
    props: {
      apiContextPath: {
        type: String as PropType<string>,
        default: undefined
      }
    },
    data() {
      const userId: unknown = null
      const userOptions: unknown = []
      const candidateUserIds: unknown = null
      const candidateUserOptions: unknown = []
      const candidateGroups: unknown = null
      const candidateGroupsOptions: unknown = []
      const userOptionsLoading = true
      const candidateUserOptionsLoading = true
      const candidateGroupsOptionsLoading = true
      return {
        userId,
        userOptions,
        userOptionsLoading,
        candidateUserIds,
        candidateUserOptions,
        candidateUserOptionsLoading,
        candidateGroups,
        candidateGroupsOptions,
        candidateGroupsOptionsLoading
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    mounted() {
      this.reloadUserGroupData()
      this.loadUserOptions().then((userOptions) => {
        this.userOptions = userOptions
        this.userOptionsLoading = false
      })
      this.loadCandidateUserOptions().then((candidateUserOptions) => {
        this.candidateUserOptions = candidateUserOptions
        this.candidateUserOptionsLoading = false
      })
      this.loadCandidateGroupsOptions().then((candidateGroupsOptions) => {
        this.candidateGroupsOptions = candidateGroupsOptions
        this.candidateGroupsOptionsLoading = false
      })
      EventEmitter.on('element-update', this.reloadUserGroupData)
    },
    methods: {
      reloadUserGroupData() {
        this.userId = getAssignee(this.getActive as Base)
        this.candidateUserIds = getCandidateUsers(this.getActive as Base)
        this.candidateGroups = getCandidateGroups(this.getActive as Base)
      },
      updateAssignee(value) {
        setAssignee(this.getActive as Base, value)
      },
      updateCandidateUsers(value) {
        setCandidateUsers(this.getActive as Base, value)
      },
      updateCandidateGroups(value) {
        setCandidateGroups(this.getActive as Base, value)
      },
      async loadUserOptions() {
        return new Promise((resolve) => {
          axios.get(`${this.apiContextPath}/lc/process-resource/list-user`).then((res) => {
            if (res.data.status === 'success') {
              const data = res.data.data
              const userDatum: { label: string; value: string }[] = []
              data.forEach((user) => {
                userDatum.push({ label: user.name, value: user.id })
              })
              resolve(userDatum)
            } else {
              this.userOptionsLoading = false
            }
          })
        })
      },
      async loadCandidateUserOptions() {
        return new Promise((resolve) => {
          axios.get(`${this.apiContextPath}/lc/process-resource/list-user`).then((res) => {
            if (res.data.status === 'success') {
              const data = res.data.data
              const userDatum: { label: string; value: string }[] = []
              data.forEach((user) => {
                userDatum.push({ label: user.name, value: user.id })
              })
              resolve(userDatum)
            } else {
              this.candidateUserOptionsLoading = false
            }
          })
        })
      },
      async loadCandidateGroupsOptions() {
        return new Promise((resolve) => {
          axios.get(`${this.apiContextPath}/lc/process-resource/list-role`).then((res) => {
            if (res.data.status === 'success') {
              const data = res.data.data
              const roleDatum: { label: string; value: string }[] = []
              data.forEach((role) => {
                roleDatum.push({ label: role.name, value: role.id })
              })
              resolve(roleDatum)
            } else {
              this.candidateGroupsOptionsLoading = false
            }
          })
        })
      }
    }
  })
</script>
