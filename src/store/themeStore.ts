"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEME_CONFIG } from "@/shared/constants/appConfig";

interface ThemeState {
  theme: string;
  colorTheme: string;
  customColor: string;
  setTheme: (theme: string) => void;
  setColorTheme: (colorTheme: string) => void;
  setCustomColorTheme: (color: string) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: THEME_CONFIG.defaultTheme,
      colorTheme: "coral",
      customColor: "#3b82f6",

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      setColorTheme: (colorTheme) => {
        set({ colorTheme });
        applyColorTheme(colorTheme, get().customColor);
      },

      setCustomColorTheme: (color) => {
        const normalized = normalizeHexColor(color);
        set({ colorTheme: "custom", customColor: normalized });
        applyColorTheme("custom", normalized);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      initTheme: () => {
        const { theme, colorTheme, customColor } = get();
        applyTheme(theme);
        applyColorTheme(colorTheme, customColor);
      },
    }),
    {
      name: THEME_CONFIG.storageKey,
    }
  )
);

export const COLOR_THEMES: Record<string, string> = {
  coral: "#e54d5e",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  violet: "#8b5cf6",
  orange: "#f97316",
  cyan: "#06b6d4",
};

// Apply light/dark theme to document
function applyTheme(theme: string) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  const dark = effectiveTheme === "dark";
  root.classList.toggle("dark", dark);
  root.dataset.theme = dark ? "dark" : "light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#000000" : "#ffffff");
}

function applyColorTheme(_colorTheme: string, _customColor: string) {
  if (typeof window === "undefined") return;

  // Chrome is the Jump OS amber palette. Stored accent picks must not repaint it.
  const root = document.documentElement;
  for (const name of [
    "--color-primary",
    "--color-primary-hover",
    "--color-accent",
    "--color-accent-hover",
    "--color-accent-light",
  ]) {
    root.style.removeProperty(name);
  }
}

function normalizeHexColor(color: string) {
  const value = (color || "").trim();
  const hex = value.startsWith("#") ? value : `#${value}`;
  const valid = /^#([0-9a-fA-F]{6})$/.test(hex);
  return valid ? hex.toLowerCase() : "#3b82f6";
}

export default useThemeStore;
