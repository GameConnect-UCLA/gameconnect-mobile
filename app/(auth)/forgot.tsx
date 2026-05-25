import { useState } from "react";
import { StyleSheet, TextInput, Pressable, Text, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { AuthBackground } from "@/src/components/auth/auth-background";
import { AuthCard } from "@/src/components/auth/auth-card";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  // Simulación de estado de carga para el ActivityIndicator
  const isPending = false;

  const isFormValid = email.trim().length > 0;

  return (
    <AuthBackground>
      <AuthCard>
        <Text
          style={styles.titleTxt}
        >
            ¿Olvidaste tu contraseña?
        </Text>
        <Text
          style={styles.description}
        >
          Ingresa tu correo electrónico a continuación y te enviaremos un enlace
          para restablecer tu contraseña.
        </Text>
        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="gray"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
        />

        <Pressable
          style={[styles.btn, !isFormValid && styles.btnDisabled]}
          disabled={!isFormValid || isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Enviar solicitud</Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>Volver al inicio</Text>
        </Link>
        <Link href="/(auth)/recovery" style={styles.link}>
            <Text style={styles.linkText}>Recuperar Contraseña</Text>
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
  description: { color: "#000", fontSize: 14, marginBottom: 20, textAlign: "center", opacity: 0.72},
  titleTxt: { color: "#000", fontSize: 20, marginBottom: 20, fontWeight: "semibold", textAlign: "center", }
});
