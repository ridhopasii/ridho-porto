export async function queryRowsFallback<T>(
  tables: string[],
  buildQuery: (table: string) => any,
): Promise<T[]> {
  for (const table of tables) {
    const { data, error } = await buildQuery(table);

    if (!error && Array.isArray(data) && data.length > 0) {
      return data as T[];
    }
  }

  return [];
}

export async function querySingleFallback<T>(
  tables: string[],
  buildQuery: (table: string) => any,
): Promise<T | null> {
  for (const table of tables) {
    const { data, error } = await buildQuery(table);

    if (!error && data) {
      return data as T;
    }
  }

  return null;
}
