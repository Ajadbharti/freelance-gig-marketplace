import { useSyncExternalStore } from "react";

const PREFIX = "gigmarket:";

// Ek key ke liye LocalStorage-backed store banata hai.
// Server par (aur hydration ke dauran) seed value milti hai, browser mein saved value.
export function createPersistedStore(key, seed) {
  const storageKey = PREFIX + key;
  const listeners = new Set();
  let cached = { raw: null, value: seed };
  let useMemory = false;
  let memoryValue = seed;

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function getSnapshot() {
    if (useMemory) return memoryValue;
    let raw = null;
    try {
      raw = window.localStorage.getItem(storageKey);
    } catch {
      return cached.value;
    }
    if (raw === null) return seed;
    if (raw === cached.raw) return cached.value;
    try {
      cached = { raw, value: JSON.parse(raw) };
    } catch {
      return seed;
    }
    return cached.value;
  }

  function getServerSnapshot() {
    return seed;
  }

  function set(next) {
    const current = getSnapshot();
    const value = typeof next === "function" ? next(current) : next;
    const raw = JSON.stringify(value);
    try {
      window.localStorage.setItem(storageKey, raw);
      useMemory = false;
    } catch {
      // Storage blocked ya full ho to sirf memory mein rakho
      useMemory = true;
      memoryValue = value;
    }
    cached = { raw, value };
    notify();
  }

  function subscribe(callback) {
    listeners.add(callback);
    // Doosre tab mein badlav hone par bhi update ho
    const onStorage = (event) => {
      if (event.key === storageKey || event.key === null) callback();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { subscribe, getSnapshot, getServerSnapshot, set };
}

export function usePersistedStore(store) {
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return [value, store.set];
}

const subscribeNothing = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

// Server aur hydration ke dauran false, uske baad browser mein true
export function useIsClient() {
  return useSyncExternalStore(subscribeNothing, getTrue, getFalse);
}