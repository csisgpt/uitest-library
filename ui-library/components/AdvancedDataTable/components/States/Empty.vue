<template>
  <td :colspan="colspan" :class="styles.empty">
    <BaseIcon name="inbox" /> {{ text }}
  </td>
</template>
<script setup lang="ts">
import BaseIcon from "../../../BaseIcon/BaseIcon.vue";
import styles from '../../UltimateDataTable.module.css';
defineProps<{ colspan: number; text: string }>();
</script>
