import { Base } from 'diagram-js/lib/model'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import modelerStore from '@/store/modeler'
import editorStore from '@/store/editor'

// 根据元素获取 assignee 属性
export function getAssignee(element: Base): string | null {
  return element?.businessObject.assignee
}

// 根据元素获取 candidateUsers 属性
export function getCandidateUsers(element: Base): string[] {
  let candidateUsers = element?.businessObject.candidateUsers
  candidateUsers = candidateUsers === '' ? null : candidateUsers
  return candidateUsers?.split(',') || null
}

// 根据输入内容设置 assignee 属性
export function setAssignee(element: Base, value: string): void {
  const store = modelerStore()
  const editor = editorStore()

  const modeling = store.getModeling
  const prefix = editor.getProcessEngine
  modeling?.updateProperties(element, { [`${prefix}:assignee`]: value })
}

// 根据输入内容设置 candidateUsers 属性
export function setCandidateUsers(element: Base, value: string[] | string): void {
  const store = modelerStore()
  const editor = editorStore()

  const modeling = store.getModeling
  const prefix = editor.getProcessEngine

  if (typeof value !== 'string') value = value.join(',')
  modeling?.updateProperties(element, { [`${prefix}:candidateUsers`]: value })
}

export function isUserTask(element: Base): boolean {
  return is(element, 'bpmn:UserTask')
}
