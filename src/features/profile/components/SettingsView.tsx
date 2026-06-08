/** Settings screen component */
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ImageBackground,
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

const BG_IMAGE = require("@/assets/images/bgbody.png");

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
  const [birthVisible, setBirthVisible] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState("Alto");
  const [language] = useState("Español");

  const handleVolume = async () => {
    const ok = await confirm({
      title: "Ajuste de Sonido",
      message: "¿Deseas silenciar los efectos de la app?",
      confirmText: "Sí, silenciar",
    });
    if (ok) setVolumeLevel("Silenciado");
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Cerrar Sesión",
      message: "¿Estas seguro de que quieres salir de tu cuenta?",
      confirmText: "Salir",
    });
    if (ok) replace("/(auth)/login");
  };

  const handleDeleteAccount = async () => {
    const ok = await confirm({
      title: "Eliminar Cuenta",
      message:
        "Esta acción es permanente y borrará todos tus datos. ¿Quieres continuar?",
      confirmText: "Eliminar",
    });
    if (ok) console.log("Cuenta eliminada");
  };

  const handleLogoutAll = async () => {
    const ok = await confirm({
      title: "Cerrar sesion en todas las cuentas",
      message:
        "Se cerrará sesión en todos tus dispositivos. ¿Quieres Continuar?",
      confirmText: "Cerrar en todos",
    });
    if (ok) replace("/(auth)/login");
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
            <Text style={styles.headerTitle}>Ajustes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerLine} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#000" />
              <Text style={styles.sectionTitle}>Ajuste de Cuenta</Text>
            </View>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon="lock-closed-outline"
                title="Contraseña"
                subtext="Cambiar contraseña"
                onPress={() => push("/user/change-password")}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="calendar-outline"
                title="Fecha de Nacimiento"
                hasSwitch
                isEnabled={birthVisible}
                onToggle={() => setBirthVisible(!birthVisible)}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Ionicons name="globe-outline" size={20} color="#000" />
              <Text style={styles.sectionTitle}>Preferencias</Text>
            </View>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon="notifications-outline"
                title="Notificación"
                subtext="Alertas y avisos"
                hasSwitch
                isEnabled={notifEnabled}
                onToggle={() => setNotifEnabled(!notifEnabled)}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="volume-high-outline"
                title="Sonidos"
                subtext={`Efectos: ${volumeLevel}`}
                onPress={handleVolume}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="eye-outline"
                title="Privacidad de la Cuenta"
                hasSwitch
                isEnabled={privacyEnabled}
                onToggle={() => setPrivacyEnabled(!privacyEnabled)}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="language-outline"
                title="Idioma"
                subtext={language}
                onPress={() => showToast("Seleccionado: Español", "info")}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#000"
              />
              <Text style={styles.sectionTitle}>Seguridad y Soporte</Text>
            </View>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon="shield-outline"
                title="Privacidad y Seguridad"
                onPress={() => showToast("Tu cuenta está protegida.", "info")}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="mail-outline"
                title="Centro de Ayuda"
                onPress={() =>
                  showToast("Contacto: soporte@gameconnect.com", "info")
                }
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="log-out-outline"
                title="Cerrar Sesion en Todas las Cuentas"
                onPress={handleLogoutAll}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem
                icon="trash-outline"
                title="Eliminar Cuenta"
                isDestructive
                onPress={handleDeleteAccount}
              />
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
});
