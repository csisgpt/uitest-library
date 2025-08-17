export function get(obj: any, path?: string) {
  if (!path) return obj;
  return path.split('.').reduce((acc: any, key: string) => (acc == null ? undefined : acc[key]), obj);
}
