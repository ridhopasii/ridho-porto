import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;
const DEBOUNCE_MS = 150;

export interface UseAdminListOptions<T> {
  items: T[];
  searchFields: Array<keyof T>;
  pageSize?: number;
}

export interface UseAdminListResult<T> {
  search: string;
  setSearch: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  paginated: T[];
  filtered: T[];
  selected: Set<string | number>;
  toggleSelect: (id: string | number) => void;
  toggleAll: () => void;
  clearSelected: () => void;
  allSelected: boolean;
  partialSelected: boolean;
}

export function useAdminList<T extends { id: string | number }>({
  items,
  searchFields,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseAdminListOptions<T>): UseAdminListResult<T> {
  const [search, setSearchRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPageRaw] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search — don't filter on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const setSearch = useCallback((v: string) => {
    setSearchRaw(v);
    setPageRaw(1);
    setSelected(new Set());
  }, []);

  const setPage = useCallback((p: number) => {
    setPageRaw(p);
    setSelected(new Set());
  }, []);

  // Stable key for searchFields — avoids useMemo re-running when array reference changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchKey = useMemo(() => searchFields.join(","), [searchFields.join(",")]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return items;
    const fields = searchKey.split(",") as Array<keyof T>;
    return items.filter((item) =>
      fields.some((field) => {
        const val = item[field];
        if (typeof val === "string") return val.toLowerCase().includes(q);
        if (typeof val === "number") return String(val).includes(q);
        if (Array.isArray(val))
          return val.some((v) => typeof v === "string" && v.toLowerCase().includes(q));
        return false;
      })
    );
  }, [items, debouncedSearch, searchKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  const toggleSelect = useCallback((id: string | number) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === paginated.length
        ? new Set()
        : new Set(paginated.map((i) => i.id))
    );
  }, [paginated]);

  const clearSelected = useCallback(() => setSelected(new Set()), []);

  return {
    search,
    setSearch,
    page: safePage,
    setPage,
    totalPages,
    paginated,
    filtered,
    selected,
    toggleSelect,
    toggleAll,
    clearSelected,
    allSelected: paginated.length > 0 && selected.size === paginated.length,
    partialSelected: selected.size > 0 && selected.size < paginated.length,
  };
}
