"use client";

/**
 * usePersistedFilters
 *
 * Persists list filter state in sessionStorage so that when a user navigates
 * to a detail page and returns (or refreshes the detail page and goes back),
 * their filters are automatically restored to the list URL.
 *
 * Usage:
 *   usePersistedFilters('employees-filters', ['name', 'role'])
 *
 * How it works:
 *   - Whenever filter params change in the URL → save them to sessionStorage.
 *   - On mount, if the URL has NO filter params → restore from sessionStorage
 *     via router.replace() so the URL reflects the saved filters.
 *   - When all filter params are empty (user explicitly cleared) → clear storage.
 */

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function usePersistedFilters(
  storageKey: string,
  filterKeys: string[]
): void {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Prevent the save effect from firing while we are mid-restore
  const isRestoringRef = useRef(false);

  // ── Restore on mount ────────────────────────────────────────────────────────
  // Run only once when the component mounts. If the URL already contains at
  // least one of the watched filter keys we do nothing (the filter is already
  // in place, e.g. user manually typed a URL or followed a shared link).
  useEffect(() => {
    const hasFiltersInURL = filterKeys.some((key) => searchParams.get(key));
    if (hasFiltersInURL) return;

    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return;

    let filters: Record<string, string>;
    try {
      filters = JSON.parse(stored) as Record<string, string>;
    } catch {
      sessionStorage.removeItem(storageKey);
      return;
    }

    const hasStoredFilters = Object.values(filters).some((v) => v);
    if (!hasStoredFilters) return;

    // Block the save effect while we programmatically change the URL
    isRestoringRef.current = true;

    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);

    // Allow the save effect to work again after the next render cycle
    const timer = setTimeout(() => {
      isRestoringRef.current = false;
    }, 150);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty – run only on mount

  // ── Persist on change ───────────────────────────────────────────────────────
  // Whenever the watched filter params change, mirror them to sessionStorage.
  useEffect(() => {
    if (isRestoringRef.current) return;

    const currentFilters: Record<string, string> = {};
    let hasAnyFilter = false;

    for (const key of filterKeys) {
      const value = searchParams.get(key);
      if (value) {
        currentFilters[key] = value;
        hasAnyFilter = true;
      }
    }

    if (hasAnyFilter) {
      sessionStorage.setItem(storageKey, JSON.stringify(currentFilters));
    } else {
      // All filters were cleared by the user – remove from storage so we
      // don't ghost-restore them on the next visit.
      sessionStorage.removeItem(storageKey);
    }
  }, [searchParams, filterKeys, storageKey]);
}
