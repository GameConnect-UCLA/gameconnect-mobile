import { Text, StyleSheet, TextInput, Pressable, ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { useSignup } from '@/src/features/auth/hooks/useSignup'
import { useToastStore } from '@/src/core/store/toast.store'
import { DatePicker } from '@/src/core/components/DatePicker'
import { Colors } from '@/src/core/theme'
import { AuthCard } from '@/src/features/auth/components/AuthCard'
import { AuthBackground } from '@/src/features/auth/components/AuthBackground'

export default function SignUpView() {
  const [form, setForm] = useState({ email: '', username: '', password: '', repeatPassword: '', birth_date: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { mutate, isPending } = useSignup()
  const showToast = useToastStore((s) => s.showToast)
  const maxBirthDate = new Date()
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 13)

  const handleSignup = () => {
    if (!form.email || !form.username || !form.password || !form.repeatPassword || !form.birth_date)
      return showToast('Por favor, rellena todos los campos', 'warning')
    if (!/\S+@\S+\.\S+/.test(form.email))
      return showToast('Por favor, ingresa un correo electrónico válido', 'warning')
    if (form.username.trim().length < 3)
      return showToast('El nombre de usuario debe tener al menos 3 caracteres', 'warning')
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/.test(form.password))
      return showToast('La contraseña debe tener al menos 8 caracteres', 'warning')
    if (form.password !== form.repeatPassword)
      return showToast('Las contraseñas no coinciden', 'warning')
    mutate(form, { onSuccess: () => { setSuccessMessage('¡Registro Exitoso!'); router.replace('/(tabs)') }, onError: (err) => showToast(err.message, 'error') })
  }

  return (
    <AuthBackground>
      <AuthCard>
        {!!successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        <TextInput placeholder="Correo Electrónico" placeholderTextColor="gray" value={form.email} onChangeText={(val) => setForm({ ...form, email: val })} style={styles.input} />
        <TextInput placeholder="Usuario" placeholderTextColor="gray" value={form.username} onChangeText={(val) => setForm({ ...form, username: val })} style={styles.input} />
        <View style={styles.inputWrapper}>
          <TextInput placeholder="Contraseña" placeholderTextColor="gray" secureTextEntry={!showPassword} value={form.password} onChangeText={(val) => setForm({ ...form, password: val })} style={[styles.input, styles.inputInner]} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput placeholder="Confirmar Contraseña" placeholderTextColor="gray" secureTextEntry={!showRepeatPassword} value={form.repeatPassword} onChangeText={(val) => setForm({ ...form, repeatPassword: val })} style={[styles.input, styles.inputInner]} />
          <TouchableOpacity onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
            <Ionicons name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <DatePicker label="Fecha de Nacimiento" value={form.birth_date} onChange={(val) => setForm({ ...form, birth_date: val })} maximumDate={maxBirthDate} />
        <Pressable style={styles.btn} onPress={handleSignup} disabled={isPending}>
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Regístrate</Text>}
        </Pressable>
        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>¿Ya posees cuenta? Ingresa Aquí</Text>
        </Link>
      </AuthCard>
    </AuthBackground>
  )
}

const styles = StyleSheet.create({
  input: { minHeight: 45, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, fontSize: 16, color: '#000' },
  inputInner: { flex: 1, borderBottomWidth: 0, marginBottom: 0 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15 },
  btn: { backgroundColor: Colors.accent, borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 15, alignSelf: 'center' },
  linkText: { color: '#555', fontSize: 13 },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10 },
})
