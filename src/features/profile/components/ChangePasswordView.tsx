/** Change password screen */
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { useToastStore } from "@/src/core/store/toast.store";
import { Colors, Spacing, Typography } from "@/src/core/theme";
import { useNavigation } from "@/src/core/hooks/useNavigation";
import { authApi } from "@/src/features/auth/api/auth.api";

const BG_IMAGE = require("@/assets/images/bgbody.png");

/** Change password screen with current, new, confirm fields @returns ChangePasswordView component */
export const ChangePasswordView = () => {
  const { back } = useNavigation();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: () =>
      authApi.changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
      }),
    onSuccess: () => {
      showToast("Tu contraseña ha sido actualizada correctamente.", "success");
      back();
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });

  const handleUpdate = () => {
    if (!currentPass || !newPass || !confirmPass) {
      showToast("Por favor completa todos los campos.", "error");
      return;
    }
    if (newPass !== confirmPass) {
      showToast("Las nuevas contraseñas no coinciden.", "error");
      return;
    }
    updatePassword();
  };

  return (
    <ImageBackground source={BG_IMAGE} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={20}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={30} color="#000" />
              <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.centerContainer}>
            <View style={styles.card}>
              <Text style={styles.label}>Contraseña Actual</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showCurrent}
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Nueva Contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showNew}
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showConfirm}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.btn}
                onPress={handleUpdate}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnText}>Actualizar Contraseña</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  backBtn: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "bold",
    marginLeft: 10,
    fontFamily: "Inter",
  },
  centerContainer: { flex: 1, paddingHorizontal: 20 },
  card: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 30,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    color: "#333",
    fontFamily: "Inter",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 55,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: { flex: 1, color: "#000", fontSize: Typography.sizes.lg },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    elevation: 3,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 17,
    fontFamily: "Inter",
  },
});
