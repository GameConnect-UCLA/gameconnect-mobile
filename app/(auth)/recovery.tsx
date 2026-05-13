import { useState } from "react";
import { StyleSheet, TextInput, Pressable, Text, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { AuthBackground } from "@/src/components/auth/auth-background";
import { AuthCard } from "@/src/components/auth/auth-card";

export default function ResetPasswordScreen() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const isPending = false;

  // Validación: campos llenos y que coincidan
  const isFormValid = 
    form.password.trim().length > 0 && 
    form.confirmPassword.trim().length > 0 && 
    form.password === form.confirmPassword;

  return (
    <AuthBackground>
      <AuthCard>
        <Text style={styles.titleTxt}>
          Restablecer contraseña
        </Text>
        
        <Text style={styles.description}>
          Crea una nueva contraseña para tu cuenta. Asegúrate de que ambas coincidan.
        </Text>

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="gray"
          secureTextEntry
          onChangeText={(val) => setForm({ ...form, password: val })}
          value={form.password}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirmar contraseña"
          placeholderTextColor="gray"
          secureTextEntry
          onChangeText={(val) => setForm({ ...form, confirmPassword: val })}
          value={form.confirmPassword}
          style={styles.input}
        />

        <Pressable
          style={[styles.btn, !isFormValid && styles.btnDisabled]}
          disabled={!isFormValid || isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Actualizar contraseña</Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" style={styles.link}>
            <Text style={styles.linkText}>Cancelar</Text>
        </Link>
        <Link href="/(auth)/forgot" style={styles.link}>
            <Text style={styles.linkText}>¿No recibiste el correo?</Text>
        </Link>
      </AuthCard>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  input: { height: 45, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 20, fontSize: 16, color: "#000" },
  btn: { backgroundColor: "#9b1999", borderRadius: 25, padding: 15, alignItems: "center", marginTop: 10 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
  link: { marginTop: 20, alignSelf: "center" },
  linkText: { color: "#555", fontSize: 13 },
  description: { color: "#000", fontSize: 14, marginBottom: 20, textAlign: "center", opacity: 0.72 },
  titleTxt: { color: "#000", fontSize: 20, marginBottom: 20, fontWeight: "semibold", textAlign: "center" }
});