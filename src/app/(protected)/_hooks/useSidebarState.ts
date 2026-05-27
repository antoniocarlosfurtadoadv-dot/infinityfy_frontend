import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar_open";

function getInitialState(): boolean {
  if (typeof window === "undefined") return true;
  const isDesktop = window.innerWidth >= 1024;
  const stored = localStorage.getItem(STORAGE_KEY);
  // On mobile, always start closed regardless of stored value
  if (!isDesktop) return false;
  // On desktop, use stored preference or default to open
  return stored !== null ? stored === "true" : true;
}

export function useSidebarState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialState);

  // Persist state on change (desktop only)
  const setSidebarOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    setIsSidebarOpen((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (window.innerWidth >= 1024) {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        // On resize to desktop, restore stored preference
        const stored = localStorage.getItem(STORAGE_KEY);
        setIsSidebarOpen(stored !== null ? stored === "true" : true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return {
    isSidebarOpen,
    setIsSidebarOpen: setSidebarOpen,
    toggleSidebar,
    closeSidebarOnMobile,
  };
}
