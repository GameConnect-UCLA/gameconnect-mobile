import { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '@/src/hooks/useAuth'
import { useAuthStore } from '@/src/store/auth.store'


const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  NETWORK_ERROR: 'Sin conexión, intenta de nuevo',
  SERVER_ERROR: 'Error del servidor, intenta más tarde',
}

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const { isLoading, error } = useAuthStore()
  const router = useRouter()


  const handleLogin = async () => {
    const success = await login({ email, password })
    if (success) router.replace('/(tabs)')
  }



  return (
    <View style={styles.container}>

      {error && (
        <Text style={{ color: 'red' }}>
          {ERROR_MESSAGES[error] ?? 'Error desconocido'}
        </Text>
      )}
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="example@email.com"
        placeholderTextColor={"gray"}
        onChangeText={newEmail => setEmail(newEmail)}
        defaultValue={email}
        style={styles.textInput}
      />

      <TextInput
        placeholder="password"
        placeholderTextColor={"gray"}
        onChangeText={newPassword => setPassword(newPassword)}
        defaultValue={password}
        secureTextEntry={true}
        style={styles.textInput}
      />

      <Pressable style={styles.loginBtn} onPress={handleLogin}>
        {isLoading ? <ActivityIndicator style={styles.loading} />
          : <Text>Login</Text>}
      </Pressable>


      <Link href="/(tabs)">
        <Text style={styles.link}>Go to Tabs (bypass auth)</Text>
      </Link>
      <Link href="/register">
        <Text style={styles.link}>Don't have an account? Register</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    color: 'blue',
    marginTop: 10,
  },
  textInput: {
    height: 40,
    padding: 5,
    marginHorizontal: 8,
    borderWidth: 1,
    minWidth: 120,
    color: "#000"
  },
  loading: {
    marginHorizontal: 0,
    marginVertical: 0
  },
  loginBtn: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 4,
    backgroundColor: "yellow"
  }
});
