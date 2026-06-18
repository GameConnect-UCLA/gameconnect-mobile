import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { useToastStore } from "@/src/core/store/toast.store";
import { Colors } from "@/src/core/theme";
import { AuthBackground } from "@/src/features/auth/components/AuthBackground";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { apiClient } from "@/src/core/api/client";

export default function LoginView() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const showToast = useToastStore((s) => s.showToast);

  const handleLogin = () => {
    if (!form.email || !form.password)
      return showToast("Por favor, rellena todos los campos", "warning");
    mutate(form, {
      onSuccess: () => router.replace("/(tabs)"),
      onError: (err) => showToast(err.message, "error"),
    });
  };

  return (
    <AuthBackground>
      <AuthCard>
        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="gray"
          onChangeText={(val) => setForm({ ...form, email: val })}
          value={form.email}
          style={styles.input}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            onChangeText={(val) => setForm({ ...form, password: val })}
            value={form.password}
            style={[styles.input, styles.inputInner]}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <Pressable
          style={styles.btn}
          onPress={handleLogin}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Ingresar</Text>
          )}
        </Pressable>
        <Link href="/(auth)/signup" style={styles.link}>
          <Text style={styles.linkText}>
            ¿No tienes cuenta? Regístrate Aquí
          </Text>
        </Link>
        <Link href="/(auth)/forgot" style={styles.link}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </Link>
      </AuthCard>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  inputInner: {
    flex: 1,
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
  link: { marginTop: 20, alignSelf: "center" },
  linkText: { color: "#555", fontSize: 13 },
});
