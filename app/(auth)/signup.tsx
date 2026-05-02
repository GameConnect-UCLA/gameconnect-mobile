import { Text, View, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useSignup } from '@/src/hooks/useAuth';
import { DateOfBirthInput } from '@/src/components/signup/DateOfBirthInput';

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [birthDate, setBirthDate] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { mutate, isPending, error, isError } = useSignup();
  const router = useRouter()

  const handleSignup = () => {
    
    // agregar verificacion de cada campo
    mutate({email, username, password, birthDate})
    setTimeout(() => {
      setSuccessMessage("Registro Exitoso!")
    }, 2000)
    setSuccessMessage("")
    router.replace("/(tabs)/profile"); 
  }

  return (
    <View style={styles.container}>
      {
        !!successMessage && (
          <Text style={{ color: 'green' }}>
          {successMessage}
        </Text>
      )}
        
      {isError && (
        <Text style={{ color: 'red' }}>
          {error.message ?? 'Error desconocido'}
        </Text>
      )}
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="example@email.com"
        placeholderTextColor={"gray"}
        onChangeText={setEmail}
        defaultValue={email}
        style={styles.textInput}
      />

      <TextInput
        placeholder="username"
        placeholderTextColor={"gray"}
        onChangeText={setUsername}
        defaultValue={username}
        style={styles.textInput}
      />

      <TextInput
        placeholder="password"
        placeholderTextColor={"gray"}
        onChangeText={setPassword}
        defaultValue={password}
        secureTextEntry={true}
        style={styles.textInput}
      />

          <TextInput
        placeholder="repeat password"
        placeholderTextColor={"gray"}
        onChangeText={setRepeatPassword}
        defaultValue={repeatPassword}
        secureTextEntry={true}
        style={styles.textInput}
      />

        <DateOfBirthInput 
        label="Fecha de Nacimiento"
        value={birthDate}
        onChange={setBirthDate}
      />

      <Pressable style={styles.loginBtn} onPress={handleSignup}>
        {isPending ? <ActivityIndicator style={styles.pending} />
          : <Text>Sign Up</Text>}
      </Pressable>


      <Link href="/(tabs)">
        <Text style={styles.link}>Have an account? Login</Text>
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
