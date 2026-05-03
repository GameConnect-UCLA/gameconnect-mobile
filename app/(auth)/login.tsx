import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useLogin } from '@/src/hooks/useAuth';
import { AuthBackground } from '@/src/components/auth/auth-background';
import { AuthCard } from '@/src/components/auth/auth-card';
import { AuthTitle } from '@/src/components/auth/auth-title';

export default function LoginScreen() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { mutate, isPending, error, isError } = useLogin();
  const router = useRouter();

  const handleLogin = () => {
    if (!form.email || !form.password) return alert("Por favor, rellena todos los campos");

    mutate(form, {
      onSuccess: () => router.replace("/(tabs)")
    });
  };

  return (
    <AuthBackground>
      <AuthTitle />

      <AuthCard>
        {isError && <Text style={styles.errorText}>{error.message ?? 'Error desconocido'}</Text>}

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

        <Pressable style={styles.btn} onPress={handleLogin} disabled={isPending}>
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Ingresar</Text>
          )}
        </Pressable>

        <Link href="/(auth)/signup" style={styles.link}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate Aquí</Text>
        </Link>
      </AuthCard>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  input: { height: 45, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, fontSize: 16, color: '#000',},
  btn: { backgroundColor: "#9b1999", borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 10, },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18, },
  link: { marginTop: 20, alignSelf: 'center', },
  linkText: { color: '#555', fontSize: 13, },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10, },
});