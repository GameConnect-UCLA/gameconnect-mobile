import { useState } from 'react'
import { StyleSheet, TextInput, Pressable, Text, ActivityIndicator } from 'react-native'
import { Link, router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { AuthBackground } from '@/src/features/auth/components/AuthBackground'
import { AuthCard } from '@/src/features/auth/components/AuthCard'
import { Colors } from '@/src/core/theme'
import { useToastStore } from '@/src/core/store/toast.store'
import { authApi } from '@/src/features/auth/api/auth.api'

export default function RecoveryView() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const showToast = useToastStore((s) => s.showToast)
  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.resetPassword(form),
    onSuccess: () => {
      showToast('Contraseña actualizada correctamente.', 'success')
      router.replace('/(auth)/login')
    },
    onError: (err: Error) => showToast(err.message, 'error'),
  })
  const isFormValid = form.password.trim().length > 0 && form.confirmPassword.trim().length > 0 && form.password === form.confirmPassword

  return (
    <AuthBackground>
      <AuthCard>
        <Text style={styles.titleTxt}>Restablecer contraseña</Text>
        <Text style={styles.description}>Crea una nueva contraseña para tu cuenta. Asegúrate de que ambas coincidan.</Text>
        <TextInput placeholder="Contraseña" placeholderTextColor="gray" secureTextEntry onChangeText={(val) => setForm({ ...form, password: val })} value={form.password} style={styles.input} />
        <TextInput placeholder="Confirmar contraseña" placeholderTextColor="gray" secureTextEntry onChangeText={(val) => setForm({ ...form, confirmPassword: val })} value={form.confirmPassword} style={styles.input} />
        <Pressable style={[styles.btn, !isFormValid && styles.btnDisabled]} disabled={!isFormValid || isPending} onPress={() => mutate()}>
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Actualizar contraseña</Text>}
        </Pressable>
        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>Cancelar</Text>
        </Link>
        <Link href="/(auth)/forgot" style={styles.link}>
          <Text style={styles.linkText}>¿No recibiste el correo?</Text>
        </Link>
      </AuthCard>
    </AuthBackground>
  )
}

const styles = StyleSheet.create({
  input: { height: 45, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20, fontSize: 16, color: '#000' },
  btn: { backgroundColor: Colors.accent, borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 10 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 20, alignSelf: 'center' },
  linkText: { color: '#555', fontSize: 13 },
  description: { color: '#000', fontSize: 14, marginBottom: 20, textAlign: 'center', opacity: 0.72 },
  titleTxt: { color: '#000', fontSize: 20, marginBottom: 20, fontWeight: 'semibold', textAlign: 'center' },
})
