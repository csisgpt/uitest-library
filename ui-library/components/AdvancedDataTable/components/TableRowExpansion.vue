<!-- TableRowExpansion.vue - Renders expanded row content -->
<template>
  <tr v-show="expanded" :class="styles.expanded">
    <td :colspan="colspan">
      <slot :row="row"></slot>
    </td>
  </tr>
</template>

<script setup lang="ts">
import styles from '../AdvancedDataTable.module.css';

const props = defineProps<{ row: any; colspan: number; expanded: boolean }>();
</script>
