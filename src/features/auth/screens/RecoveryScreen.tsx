import { useState } from 'react'
import { StyleSheet, TextInput, Pressable, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { AuthBackground } from '@/src/features/auth/components/AuthBackground'
import { AuthCard } from '@/src/features/auth/components/AuthCard'
import { Colors } from '@/src/core/theme'
import { useToastStore } from '@/src/core/store/toast.store'
import { authApi } from '@/src/features/auth/api/auth.api'
import { getErrorMessage } from '@/src/core/utils/error.utils'

export default function RecoveryView() {
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const showToast = useToastStore((s) => s.showToast)
  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.resetPassword({
      email,
      code,
      newPassword: form.password,
    }),
    onSuccess: () => {
      showToast('Contraseña actualizada correctamente.', 'success')
      router.replace('/(auth)/login')
    },
    onError: (err) => showToast(getErrorMessage(err, 'Error al restablecer contraseña.'), 'error'),
  })
  const isFormValid = form.password.trim().length > 0 && form.confirmPassword.trim().length > 0 && form.password === form.confirmPassword

  return (
    <AuthBackground>
      <AuthCard>
        <Text style={styles.titleTxt}>Restablecer contraseña</Text>
        <Text style={styles.description}>Crea una nueva contraseña para tu cuenta. Asegúrate de que ambas coincidan.</Text>
        <View style={styles.inputWrapper}>
          <TextInput placeholder="Contraseña" placeholderTextColor="gray" secureTextEntry={!showPassword} onChangeText={(val) => setForm({ ...form, password: val })} value={form.password} style={[styles.input, styles.inputInner]} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput placeholder="Confirmar contraseña" placeholderTextColor="gray" secureTextEntry={!showConfirmPassword} onChangeText={(val) => setForm({ ...form, confirmPassword: val })} value={form.confirmPassword} style={[styles.input, styles.inputInner]} />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
          </TouchableOpacity>
        </View>
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
  inputInner: { flex: 1, borderBottomWidth: 0, marginBottom: 0 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 },
  btn: { backgroundColor: Colors.accent, borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 10 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 20, alignSelf: 'center' },
  linkText: { color: '#555', fontSize: 13 },
  description: { color: '#000', fontSize: 14, marginBottom: 20, textAlign: 'center', opacity: 0.72 },
  titleTxt: { color: '#000', fontSize: 20, marginBottom: 20, fontWeight: 'semibold', textAlign: 'center' },
})
