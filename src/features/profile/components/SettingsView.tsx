/** Settings screen component */
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "@/src/core/theme";
import { useConfirmDialog } from "@/src/core/hooks/useConfirmDialog";
import { useToastStore } from "@/src/core/store/toast.store";
import { useNavigation } from "@/src/core/hooks/useNavigation";
import { useLogout } from "@/src/features/auth/hooks/useLogout";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { useProfile } from "../hooks/useUpdateProfile";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useUserStore } from "@/src/core/store/user.store";
import { useLanguage } from "@/src/core/context/LanguageContext";

const BG_IMAGE = require("@/assets/images/bgbody.png");

type SoundOption = {
  key: "alegre" | "suave" | "clasico" | "silencio";
  label: string;
};

const SOUND_OPTIONS: SoundOption[] = [
  { key: "alegre", label: "🎵 Alegre" },
  { key: "suave", label: "🎶 Suave" },
  { key: "clasico", label: "🎼 Clásico" },
  { key: "silencio", label: "🔇 Silenciar" },
];

/** Single settings row item @param icon Icon name @param title Title text @param subtext Subtitle text @param hasSwitch Show toggle @param isEnabled Toggle state @param onToggle Toggle handler @param onPress Press handler @param isDestructive Destructive style */
const SettingsItem = ({
  icon,
  title,
  subtext,
  hasSwitch = false,
  isEnabled = false,
  onToggle,
  onPress,
  isDestructive = false,
}: any) => {
  const content = (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={isDestructive ? "#D11D3B" : "#111"}
          style={styles.itemIcon}
        />
        <View>
          <Text
            style={[styles.itemTitle, isDestructive && { color: Colors.heart }]}
          >
            {title}
          </Text>
          {subtext && <Text style={styles.itemSubtext}>{subtext}</Text>}
        </View>
      </View>
      {hasSwitch ? (
        <Switch
          trackColor={{ false: "#D1D1D1", true: "#033563" }}
          thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
          onValueChange={onToggle}
          value={isEnabled}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      )}
    </View>
  );

  if (hasSwitch) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      {content}
    </TouchableOpacity>
  );
};

/** Settings screen with account, preferences, security sections @returns SettingsView component */
export const SettingsView = () => {
  const { confirm } = useConfirmDialog();
  const showToast = useToastStore((s) => s.showToast);
  const { push, back, replace } = useNavigation();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();
  const { language, setLanguage, t } = useLanguage();

  // ── Backend data ──────────────────────────────────────────────────────────
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { mutate: updateSettingsMutate, isPending: isUpdatingSettings } =
    useUpdateSettings();
  const { updateProfile, isPending: isUpdatingProfile } = useProfile();
  const user = useUserStore((s) => s.user);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  // Sync language context with backend setting on load
  useEffect(() => {
    if (settings?.language && settings.language !== language) {
      setLanguage(settings.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.language]);

  // Sync date picker with user's existing birthDate
  useEffect(() => {
    if (user?.birthDate) {
      const parsed = new Date(user.birthDate);
      if (!isNaN(parsed.getTime())) setSelectedDate(parsed);
    }
  }, [user?.birthDate]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
      const iso = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
      updateProfile({ birthDate: iso })
        .then(() =>
          showToast("Fecha de nacimiento modificada correctamente", "success")
        )
        .catch((e: any) =>
          showToast(
            e?.response?.data?.message || "Error al actualizar la fecha",
            "error"
          )
        );
    }
  };

  const handleNotifToggle = () => {
    const newVal = !(settings?.notifications ?? true);
    updateSettingsMutate(
      { notifications: newVal },
      {
        onSuccess: () =>
          showToast(
            newVal ? "Notificaciones activadas" : "Notificaciones desactivadas",
            "success"
          ),
      }
    );
  };

  const handlePrivacyToggle = () => {
    const newVal = !(settings?.privateAccount ?? false);
    updateSettingsMutate(
      { privateAccount: newVal },
      {
        onSuccess: () =>
          showToast(
            newVal ? "Tu cuenta ahora es Privada" : "Tu cuenta ahora es Pública",
            "success"
          ),
      }
    );
  };

  const handleSoundSelect = (option: SoundOption) => {
    setShowSoundModal(false);
    const isSilence = option.key === "silencio";
    updateSettingsMutate(
      { soundEnabled: !isSilence, soundType: option.key },
      {
        onSuccess: () =>
          showToast(`Sonido seleccionado: ${option.label}`, "success"),
      }
    );
  };

  const handleLanguageSelect = (lang: "es" | "en") => {
    setShowLangModal(false);
    setLanguage(lang);
    updateSettingsMutate(
      { language: lang },
      {
        onSuccess: () =>
          showToast(
            lang === "es" ? "Idioma: Español" : "Language: English",
            "success"
          ),
      }
    );
  };

  const handleVolume = () => setShowSoundModal(true);

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Cerrar Sesión",
      message: "¿Estás seguro de que quieres salir de tu cuenta?",
      confirmText: "Salir",
    });
    if (ok) {
      logoutMutate(undefined, {
        onSuccess: () => replace("/(auth)/login"),
      });
    }
  };

  const handleLogoutAll = async () => {
    const ok = await confirm({
      title: "Cerrar sesión en todas las cuentas",
      message: "Se cerrará sesión en todos tus dispositivos. ¿Quieres Continuar?",
      confirmText: "Cerrar en todos",
    });
    if (ok) {
      logoutMutate(undefined, {
        onSuccess: () => replace("/(auth)/login"),
      });
    }
  };

  const { mutate: deleteAccountMutate, isPending: isDeleting } = useDeleteAccount();

const handleDeleteAccount = async () => {
  const ok = await confirm({
    title: "Eliminar Cuenta",
    message: "Esta acción es permanente y borrará todos tus datos. ¿Quieres continuar?",
    confirmText: "Eliminar",
  });
  if (ok) {
    deleteAccountMutate(undefined, {
      onSuccess: () => {
        showToast("Cuenta eliminada correctamente", "success");
        replace("/(auth)/login");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Error al eliminar la cuenta";
        showToast(msg, "error");
      },
    });
  }
};

  // ── Derived values ────────────────────────────────────────────────────────
  const notifEnabled = settings?.notifications ?? true;
  const privacyEnabled = settings?.privateAccount ?? false;
  const currentSoundKey = settings?.soundType ?? "alegre";
  const currentSoundLabel =
    SOUND_OPTIONS.find((o) => o.key === currentSoundKey)?.label ?? "Alegre";
  const langLabel = language === "es" ? "Español" : "English";

  const ts = t.settings;

  return (
    <ImageBackground source={BG_IMAGE} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
            <Text style={styles.headerTitle}>{ts.title}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerLine} />

        {isLoadingSettings ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.mainCard}>
              {/* ─── Ajuste de Cuenta ─────────────────────────────────── */}
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={20} color="#000" />
                <Text style={styles.sectionTitle}>{ts.accountSection}</Text>
              </View>
              <View style={styles.sectionCard}>
                <SettingsItem
                  icon="lock-closed-outline"
                  title={ts.password}
                  subtext={ts.passwordSub}
                  onPress={() => push("/user/change-password")}
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="calendar-outline"
                  title={ts.birthDate}
                  subtext={
                    user?.birthDate
                      ? new Date(user.birthDate).toLocaleDateString()
                      : undefined
                  }
                  onPress={() => setShowDatePicker(true)}
                />
              </View>

              {/* ─── Preferencias ─────────────────────────────────────── */}
              <View style={styles.sectionHeader}>
                <Ionicons name="globe-outline" size={20} color="#000" />
                <Text style={styles.sectionTitle}>{ts.preferencesSection}</Text>
              </View>
              <View style={styles.sectionCard}>
                <SettingsItem
                  icon="notifications-outline"
                  title={ts.notifications}
                  subtext={ts.notificationsSub}
                  hasSwitch
                  isEnabled={notifEnabled}
                  onToggle={handleNotifToggle}
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="volume-high-outline"
                  title={ts.sounds}
                  subtext={currentSoundLabel}
                  onPress={handleVolume}
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="eye-outline"
                  title={ts.privacy}
                  hasSwitch
                  isEnabled={privacyEnabled}
                  onToggle={handlePrivacyToggle}
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="language-outline"
                  title={ts.language}
                  subtext={langLabel}
                  onPress={() => setShowLangModal(true)}
                />
              </View>

              {/* ─── Seguridad y Soporte ──────────────────────────────── */}
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#000"
                />
                <Text style={styles.sectionTitle}>{ts.securitySection}</Text>
              </View>
              <View style={styles.sectionCard}>
                <SettingsItem
                  icon="shield-outline"
                  title={ts.privacyAndSecurity}
                  onPress={() =>
                    showToast("Tu cuenta está protegida.", "info")
                  }
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="mail-outline"
                  title={ts.helpCenter}
                  onPress={() =>
                    showToast(
                      "Contacto: soporte@gameconnect.com",
                      "info"
                    )
                  }
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="log-out-outline"
                  title={ts.logoutAll}
                  onPress={handleLogoutAll}
                />
                <View style={styles.innerSeparator} />
                <SettingsItem
                  icon="trash-outline"
                  title={ts.deleteAccount}
                  isDestructive
                  onPress={handleDeleteAccount}
                />
              </View>

              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.logoutText}>{ts.logout}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* ─── DateTimePicker ──────────────────────────────────────────── */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* ─── Sound Modal ──────────────────────────────────────────────── */}
        <Modal
          visible={showSoundModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSoundModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowSoundModal(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Seleccionar Sonido</Text>
              {SOUND_OPTIONS.map((opt, i) => (
                <React.Fragment key={opt.key}>
                  {i > 0 && <View style={styles.innerSeparator} />}
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleSoundSelect(opt)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        currentSoundKey === opt.key && styles.modalOptionActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {currentSoundKey === opt.key && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* ─── Language Modal ───────────────────────────────────────────── */}
        <Modal
          visible={showLangModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLangModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowLangModal(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Seleccionar Idioma</Text>
              {(
                [
                  { key: "es", label: "🇪🇸 Español" },
                  { key: "en", label: "🇺🇸 English" },
                ] as const
              ).map((opt, i) => (
                <React.Fragment key={opt.key}>
                  {i > 0 && <View style={styles.innerSeparator} />}
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleLanguageSelect(opt.key)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        language === opt.key && styles.modalOptionActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {language === opt.key && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#000",
  },
  headerLine: {
    height: 1,
    backgroundColor: "#000",
    opacity: 0.1,
    marginHorizontal: 20,
  },
  scrollContent: { padding: 15, paddingBottom: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainCard: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 35,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "bold",
    color: "#000",
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: Spacing.md,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 15, flex: 1 },
  itemIcon: { width: 25 },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#000" },
  itemSubtext: { fontSize: 12, color: "#666", marginTop: 2 },
  innerSeparator: { height: 1, backgroundColor: "#EEE", marginHorizontal: 15 },
  logoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#FFF",
    fontSize: Typography.sizes.xl,
    fontWeight: "bold",
  },
  // ── Modal styles ────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 0,
    width: "100%",
    maxWidth: 340,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalOptionActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});

