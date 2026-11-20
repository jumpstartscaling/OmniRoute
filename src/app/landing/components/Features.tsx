"use client";
import { useTranslations } from "next-intl";

const FEATURES = [
  {
    icon: "link",
    titleKey: "featureUnifiedEndpointTitle",
    descKey: "featureUnifiedEndpointDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "bolt",
    titleKey: "featureEasySetupTitle",
    descKey: "featureEasySetupDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "shield_with_heart",
    titleKey: "featureModelFallbackTitle",
    descKey: "featureModelFallbackDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "monitoring",
    titleKey: "featureUsageTrackingTitle",
    descKey: "featureUsageTrackingDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "key",
    titleKey: "featureOAuthApiKeysTitle",
    descKey: "featureOAuthApiKeysDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "cloud_sync",
    titleKey: "featureCloudSyncTitle",
    descKey: "featureCloudSyncDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "terminal",
    titleKey: "featureCliSupportTitle",
    descKey: "featureCliSupportDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
  {
    icon: "dashboard",
    titleKey: "featureDashboardTitle",
    descKey: "featureDashboardDesc",
    colors: {
      border: "hover:border-[#f6c445]",
      bg: "hover:bg-[#f6c445]/10",
      iconBg: "bg-[#f6c445]",
      iconText: "text-black",
      titleHover: "group-hover:text-[#f6c445]",
    },
  },
];

export default function Features() {
  const t = useTranslations("landing");

  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("powerfulFeatures")}</h2>
          <p className="text-[#d0d0d0] max-w-xl text-lg">{t("featuresSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.titleKey}
              className={`p-6 rounded-xl bg-[#000000] border border-white ${feature.colors.border} ${feature.colors.bg} transition-all duration-300 group`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${feature.colors.iconBg} flex items-center justify-center mb-4 ${feature.colors.iconText} group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>
              <h3
                className={`text-lg font-bold mb-2 break-words ${feature.colors.titleHover} transition-colors`}
              >
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-[#d0d0d0] leading-relaxed break-words">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
