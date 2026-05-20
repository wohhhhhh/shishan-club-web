<template>
  <el-tag :type="tagType" size="small">{{ tagText }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'
import { clubStatusMap, applicationStatusMap, memberStatusMap, positionMap, activityStatusMap, checkinStatusMap } from '@/utils/enum'

const props = defineProps({
  type: { type: String, required: true },
  value: { type: String, default: '' }
})

const maps = {
  club: clubStatusMap,
  application: applicationStatusMap,
  member: memberStatusMap,
  position: positionMap,
  activity: activityStatusMap,
  checkin: checkinStatusMap
}

const map = computed(() => maps[props.type] || {})

const tagType = computed(() => {
  const item = map.value[props.value]
  return item?.type || 'info'
})

const tagText = computed(() => {
  const item = map.value[props.value]
  if (item?.text) return item.text
  if (props.type === 'position') return item || props.value
  return props.value || ''
})
</script>
