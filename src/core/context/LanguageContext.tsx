/** Language context for app-wide i18n via React Context. */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Lang = "es" | "en";

/** Translations catalogue – extend as needed */
const translations = {
  es: {
    settings: {
      title: "Ajustes",
      accountSection: "Ajuste de Cuenta",
      preferencesSection: "Preferencias",
      securitySection: "Seguridad y Soporte",
      password: "Contraseña",
      passwordSub: "Cambiar contraseña",
      birthDate: "Fecha de Nacimiento",
      notifications: "Notificaciones",
      notificationsSub: "Alertas y avisos",
      sounds: "Sonidos",
      soundsSub: "Efectos de sonido",
      privacy: "Privacidad de la Cuenta",
      language: "Idioma",
      privacyAndSecurity: "Privacidad y Seguridad",
      helpCenter: "Centro de Ayuda",
      logoutAll: "Cerrar Sesión en Todas las Cuentas",
      deleteAccount: "Eliminar Cuenta",
      logout: "Cerrar Sesión",
    },
  },
  en: {
    settings: {
      title: "Settings",
      accountSection: "Account Settings",
      preferencesSection: "Preferences",
      securitySection: "Security & Support",
      password: "Password",
      passwordSub: "Change password",
      birthDate: "Date of Birth",
      notifications: "Notifications",
      notificationsSub: "Alerts and notices",
      sounds: "Sounds",
      soundsSub: "Sound effects",
      privacy: "Account Privacy",
      language: "Language",
      privacyAndSecurity: "Privacy & Security",
      helpCenter: "Help Center",
      logoutAll: "Sign Out of All Devices",
      deleteAccount: "Delete Account",
      logout: "Sign Out",
    },
  },
} as const;

type Translations = typeof translations;
type SettingsTranslations = Translations["es"]["settings"];

type LanguageContextValue = {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: { settings: SettingsTranslations };
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

/** Provider that wraps the entire app tree. */
export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLang] = useState<Lang>("es");

  const setLanguage = useCallback((lang: Lang) => setLang(lang), []);

  const t = useMemo(
    () => translations[language] as { settings: SettingsTranslations },
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/** Hook to access language context. Throws if used outside LanguageProvider. */
export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
