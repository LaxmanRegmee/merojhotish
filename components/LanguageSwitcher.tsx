"use client";

export type Language = "np" | "en";

type LanguageSwitcherProps = {
  language: Language;
  onLanguageChange?: (language: Language) => void;
};

export default function LanguageSwitcher({
  language,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const isNepali = language === "np";

  function toggleLanguage() {
    const nextLanguage = isNepali ? "en" : "np";
    onLanguageChange?.(nextLanguage);
  }

  return (
    <div
      className="flex h-5 items-center gap-2"
      aria-label={isNepali ? "भाषा" : "Language"}
    >
      <span className="text-sm font-medium leading-5 opacity-50">NP</span>
      <button
        type="button"
        role="switch"
        aria-checked={!isNepali}
        aria-label={
          isNepali ? "भाषा अंग्रेजीमा बदल्नुहोस्" : "Switch language to Nepali"
        }
        onClick={toggleLanguage}
        className={`ui-control relative flex h-[18px] w-8 shrink-0 items-center rounded-full border-0 p-px ${isNepali ? "justify-start bg-input" : "justify-end bg-primary"}`}
      >
        <span
          aria-hidden="true"
          className={`size-4 rounded-full shadow-sm ${isNepali ? "bg-background" : "bg-primary-foreground"}`}
        />
      </button>
      <span className="text-sm font-medium leading-5 opacity-50">EN</span>
    </div>
  );
}
