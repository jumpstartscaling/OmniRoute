"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Shown when OmniRoute was started with auto-generated secrets (zero-config mode).
 * The banner is dismissable and persists only for the current session.
 */
export default function BootstrapBanner() {
  const t = useTranslations("common");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Determine default data dir hint based on platform hint from user-agent
  const dataDir =
    typeof navigator !== "undefined" && navigator.platform?.startsWith("Win")
      ? "%APPDATA%\\omniroute\\server.env"
      : "~/.omniroute/server.env";

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-[#9a3412]/40 bg-[#f8e6dc] px-4 py-3 text-sm text-[#9a3412] dark:border-[#f6c7a8]/40 dark:bg-black dark:text-[#f6c7a8] mb-4"
    >
      <span className="text-base shrink-0 mt-0.5">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">Running in zero-config mode</p>
        <p className="mt-0.5">
          OmniRoute auto-generated secure encryption keys on first launch. They are persisted to{" "}
          <code className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded text-xs">
            {dataDir}
          </code>
          . No action is required — your data is encrypted and safe. To use custom keys, add{" "}
          <code className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded text-xs">
            JWT_SECRET
          </code>{" "}
          and{" "}
          <code className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded text-xs">
            STORAGE_ENCRYPTION_KEY
          </code>{" "}
          to that file.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-colors ml-1"
        aria-label={t("bootstrapBannerDismiss")}
      >
        ✕
      </button>
    </div>
  );
}
