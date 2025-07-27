<template>
  <table class="min-w-full divide-y divide-gray-200" v-bind="$attrs">
    <thead class="bg-gray-50">
      <tr>
        <slot name="head" />
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <slot />
    </tbody>
  </table>
</template>

<script lang="ts" setup>
defineProps<{}>()
</script>
