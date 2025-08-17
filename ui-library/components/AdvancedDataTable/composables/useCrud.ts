import { reactive, ref } from 'vue';
import type { CrudHandlers } from '../types';
export function useCrud<Row = any>(handlers: CrudHandlers<Row>) {
  const creating = ref(false); const editing = ref(false); const deleting = ref(false);
  const current: any = ref<Row | null>(null); const model = reactive<Record<string, any>>({});
  const error = ref<string | null>(null); const loading = ref(false);
  function openCreate(initial: Record<string, any> = {}) { Object.keys(model).forEach(k => delete model[k]); Object.assign(model, initial); creating.value = true; }
  function openEdit(row: Row, initial: Record<string, any> = {}) { current.value = row; Object.keys(model).forEach(k => delete model[k]); Object.assign(model, initial); editing.value = true; }
  function openDelete(row: Row) { current.value = row; deleting.value = true; }
  async function submitCreate() { if (!handlers.create) return; loading.value = true; error.value = null; try { const created = await handlers.create({ ...model }); creating.value = false; return created; } catch (e: any) { error.value = e?.message || 'خطا در ایجاد'; throw e; } finally { loading.value = false; } }
  async function submitEdit() { if (!handlers.update || !current.value) return; loading.value = true; error.value = null; try { const updated = await handlers.update(current.value, { ...model }); editing.value = false; current.value = null; return updated; } catch (e: any) { error.value = e?.message || 'خطا در ویرایش'; throw e; } finally { loading.value = false; } }
  async function submitDelete() { if (!handlers.delete || !current.value) return; loading.value = true; error.value = null; try { await handlers.delete(current.value); deleting.value = false; const row = current.value; current.value = null; return row; } catch (e: any) { error.value = e?.message || 'خطا در حذف'; throw e; } finally { loading.value = false; } }
  return { creating, editing, deleting, current, model, error, loading, openCreate, openEdit, openDelete, submitCreate, submitEdit, submitDelete };
}
