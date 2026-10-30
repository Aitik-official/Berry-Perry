/**
 * Enterprise Browser Session Cache Engine
 * Zero-latency tab hydration and optimistic caching using sessionStorage.
 */

const CACHE_PREFIX = "bp_enterprise_cache_";

export function getSessionCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data as T;
  } catch (err) {
    console.warn(`[sessionCache] Failed to read key ${key}:`, err);
    return null;
  }
}

export function setSessionCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      timestamp: Date.now(),
      data,
    };
    window.sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[sessionCache] Failed to write key ${key}:`, err);
  }
}

export function clearSessionCache(key?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (key) {
      window.sessionStorage.removeItem(CACHE_PREFIX + key);
    } else {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
    }
  } catch (err) {
    console.warn("[sessionCache] Failed to clear session cache:", err);
  }
}

