import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { useToastStore } from "@/src/core/store/toast.store";
import { Colors } from "@/src/core/theme";
import { AuthBackground } from "@/src/features/auth/components/AuthBackground";
import { AuthCard } from "@/src/features/auth/components/AuthCard";

export default function LoginView() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { mutate, isPending, error, isError } = useLogin();
  const showToast = useToastStore((s) => s.showToast);

  const handleLogin = () => {
    if (!form.email || !form.password)
      return showToast("Por favor, rellena todos los campos", "warning");
    mutate(form, { onSuccess: () => {} });
  };

  return (
    <AuthBackground>
      <AuthCard>
        {isError && (
          <Text style={styles.errorText}>
            {error.message ?? "Error desconocido"}
          </Text>
        )}
        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="gray"
          onChangeText={(val) => setForm({ ...form, email: val })}
          value={form.email}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="gray"
          secureTextEntry
          onChangeText={(val) => setForm({ ...form, password: val })}
          value={form.password}
          style={styles.input}
        />
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
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
});
