import { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useLogin } from '@/src/hooks/useAuth'




export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error, isError } = useLogin();
  const router = useRouter()


  const handleLogin = () => {
    // agregar verificacion de campos 
    mutate({ email, password }, {
      onSuccess: () => router.replace("/(tabs)")
    })
   
  }



  return (
    <View style={styles.container}>

      {isError && (
        <Text style={{ color: 'red' }}>
          {error.message ?? 'Error desconocido'}
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
        {isPending ? <ActivityIndicator style={styles.pending} />
          : <Text>Login</Text>}
      </Pressable>


      <Link href="/(tabs)">
        <Text style={styles.link}>Go to Tabs (bypass auth)</Text>
      </Link>
      <Link href="/register">
        <Text style={styles.link}>Don{"'"}t have an account? Register</Text>
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
  pending: {
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
