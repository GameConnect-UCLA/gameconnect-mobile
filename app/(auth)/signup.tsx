import { Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useSignup } from '@/src/hooks/useAuth';
import { DateOfBirthInput } from '@/src/components/signup/DateOfBirthInput';
import { AuthCard } from '@/src/components/auth/auth-card';
import { AuthBackground } from '@/src/components/auth/auth-background';

export default function SignUpScreen() {
  const [form, setForm] = useState({ email: '', username: '', password: '', repeatPassword: '', birthDate: '' });
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate, isPending, error, isError } = useSignup();
  const router = useRouter();
  const handleSignup = () => {
    if (!form.email || !form.username || !form.password || !form.repeatPassword || !form.birthDate) return alert("Por favor, rellena todos los campos");
    if (!/\S+@\S+\.\S+/.test(form.email)) return alert("Por favor, ingresa un correo electrónico válido");
    if (form.username.trim().length < 3) return alert("El nombre de usuario debe tener al menos 3 caracteres");
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/.test(form.password)) return alert("La contraseña debe tener al menos 8 caracteres");
    if (form.password !== form.repeatPassword) return alert("Las contraseñas no coinciden");
    mutate(form, {
      onSuccess: () => {
        setSuccessMessage("¡Registro Exitoso!");
        setTimeout(() => router.replace("/(tabs)/profile"), 1500);
      }
    });
  };

  return (
    <AuthBackground>
      <AuthCard>
        {!!successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        {isError && <Text style={styles.errorText}>{error.message ?? 'Error'}</Text>}

        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="gray"
          value={form.email}
          onChangeText={(val) => setForm({...form, email: val})}
          style={styles.input}    
        />

        <TextInput
          placeholder="Usuario"
          placeholderTextColor="gray"
          value={form.username}
          onChangeText={(val) => setForm({...form, username: val})}
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="gray"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => setForm({...form, password: val})}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirmar Contraseña"
          placeholderTextColor="gray"
          secureTextEntry
          value={form.repeatPassword}
          onChangeText={(val) => setForm({...form, repeatPassword: val})}
          style={styles.input}
        />

        <DateOfBirthInput 
          label="Fecha de Nacimiento"
          value={form.birthDate}
          onChange={(val) => setForm({...form, birthDate: val})}
          containerStyle={styles.dateInput}
        />

        <Pressable style={styles.btn} onPress={handleSignup} disabled={isPending}>
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Regístrate</Text>}
        </Pressable>

        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>¿Ya posees cuenta? Ingresa Aquí</Text>
        </Link>
      </AuthCard>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 45, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, fontSize: 16, color: '#000' },
  dateInput: { borderBottomWidth: 1, borderBottomColor: '#ccc' },
  btn: { backgroundColor: "#9b1999", borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 15, alignSelf: 'center' },
  linkText: { color: '#555', fontSize: 13 },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 }
});