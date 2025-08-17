<template>
  <div>
    <UltimateDataTable
      v-bind="tableProps"
      :items="clientMode ? localItems : items"
      :columns="columnsWithActions"
      @row:click="(e) => $emit('row:click', e)"
      @server:query="(q) => $emit('server:query', q)"
      @update:pagination="(v) => $emit('update:pagination', v)"
      @update:sort="(v) => $emit('update:sort', v)"
      @update:filters="(v) => $emit('update:filters', v)"
      @update:search="(v) => $emit('update:search', v)"
    >
      <template #toolbar-actions-right>
        <BaseButton
          v-if="!!handlers?.create"
          @click="openCreate(createInitial ? createInitial() : {})"
          variant="primary"
          size="sm"
          ><BaseIcon name="plus" /> افزودن</BaseButton
        >
      </template>
      <template #cell-__actions="{ row }">
        <RowActions
          v-if="handlers?.update || handlers?.delete"
          @edit="openEdit(row, row)"
          @delete="openDelete(row)"
        />
      </template>
      <template v-for="(_, name) in $slots" #[name]="slotProps"
        ><slot :name="name" v-bind="slotProps"
      /></template>
    </UltimateDataTable>
    <BaseModal
      v-if="handlers?.create"
      v-model="creating"
      title="افزودن ردیف جدید"
      size="lg"
    >
      <FormRenderer :schema="formCreate" :model="crudModel" />
      <template #footer
        ><BaseButton variant="ghost" @click="creating = false"
          >انصراف</BaseButton
        ><BaseButton :disabled="crudLoading" @click="doCreate"
          >ثبت</BaseButton
        ></template
      >
    </BaseModal>
    <BaseModal
      v-if="handlers?.update"
      v-model="editing"
      title="ویرایش ردیف"
      size="lg"
    >
      <FormRenderer :schema="formEdit" :model="crudModel" />
      <template #footer
        ><BaseButton variant="ghost" @click="editing = false">انصراف</BaseButton
        ><BaseButton :disabled="crudLoading" @click="doEdit"
          >ذخیره</BaseButton
        ></template
      >
    </BaseModal>
    <BaseModal v-if="handlers?.delete" v-model="deleting" title="حذف ردیف">
      <p>از حذف این ردیف مطمئن هستید؟</p>
      <template #footer
        ><BaseButton variant="ghost" @click="deleting = false"
          >انصراف</BaseButton
        ><BaseButton :disabled="crudLoading" @click="doDelete"
          >حذف</BaseButton
        ></template
      >
    </BaseModal>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import UltimateDataTable from "./UltimateDataTable.vue";
import { BaseButton, BaseIcon, BaseModal } from "../index";
import RowActions from "./components/RowActions.vue";
import FormRenderer from "./components/FormRenderer.vue";
import type {
  Column,
  CrudHandlers,
  FormSchema,
  PaginationState,
  SortState,
  FilterModel,
} from "./types";
type Row = any;
const props = withDefaults(
  defineProps<{
    items: Row[];
    columns: Column<Row>[];
    handlers?: CrudHandlers<Row>;
    serverMode?: boolean;
    clientMode?: boolean;
    formCreate?: FormSchema;
    formEdit?: FormSchema;
    createInitial?: () => Record<string, any>;
    tableProps?: Record<string, any>;
  }>({
    serverMode: false,
    clientMode: true,
    formCreate: () => ({ fields: [] }),
    formEdit: () => ({ fields: [] }),
    createInitial: () => ({}),
    tableProps: () => ({}),
  }),
  {}
);
const emit = defineEmits<{
  (e: "row:click", value: { row: Row; index: number }): void;
  (
    e: "server:query",
    query: {
      page: number;
      pageSize: number;
      sort: SortState[];
      filters: FilterModel;
      global?: string;
    }
  ): void;
  (e: "created", row: Row): void;
  (e: "updated", row: Row): void;
  (e: "deleted", row: Row): void;
  (e: "update:items", rows: Row[]): void;
  (e: "update:pagination", v: PaginationState): void;
  (e: "update:sort", v: SortState[]): void;
  (e: "update:filters", v: FilterModel): void;
  (e: "update:search", v: string): void;
}>();
const localItems = ref<Row[]>([...props.items]);
watch(
  () => props.items,
  (v) => {
    if (!props.clientMode) return;
    localItems.value = [...v];
  },
  { deep: true }
);
const columnsWithActions = computed<Column<Row>[]>(() => {
  const has = props.columns.some((c) => c.id === "__actions");
  if (has) return props.columns;
  if (!props.handlers?.update && !props.handlers?.delete) return props.columns;
  return [
    ...props.columns,
    {
      id: "__actions",
      header: "عملیات",
      align: "center",
      sticky: "right",
      hideable: false,
    } as any,
  ];
});
import { useCrud } from "./composables/useCrud";
const {
  creating,
  editing,
  deleting,
  current,
  model: crudModel,
  loading: crudLoading,
  openCreate,
  openEdit,
  openDelete,
  submitCreate,
  submitEdit,
  submitDelete,
} = useCrud<Row>(props.handlers || {});
const formCreate = computed(() => props.formCreate!);
const formEdit = computed(() => props.formEdit!);
function doCreate() {
  submitCreate().then((created) => {
    emit("created", created);
    if (props.clientMode) {
      localItems.value = [created, ...localItems.value];
      emit("update:items", localItems.value);
    }
  });
}
function doEdit() {
  submitEdit().then((updated) => {
    emit("updated", updated);
    if (props.clientMode && current.value) {
      const idx = localItems.value.findIndex(
        (r: any) => r?.id === (current.value as any)?.id
      );
      if (idx >= 0) {
        const arr = [...localItems.value];
        arr[idx] = updated;
        localItems.value = arr;
        emit("update:items", localItems.value);
      }
    }
  });
}
function doDelete() {
  submitDelete().then((row) => {
    emit("deleted", row as any);
    if (props.clientMode && row) {
      localItems.value = localItems.value.filter(
        (r: any) => r?.id !== (row as any)?.id
      );
      emit("update:items", localItems.value);
    }
  });
}
</script>
