export async function importDefault<T>(modulePath: string): Promise<T> {
  const mod = await import(modulePath);
  return (mod.default ?? mod) as T;
}
