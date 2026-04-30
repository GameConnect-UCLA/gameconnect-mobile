import { Text, View, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import useAuth from '@/src/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function LoginScreen() {
  const {login, isLoading} = useAuth(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  async function handleLogin () {
    if (email == '' || password == '') {
      alert("Los campos estan vacios"); 
      return; 
    }

    try {
      await login({email, password});
      
    } catch (error) {
      throw error;
    }
    
  }




  return (
    <View style={styles.container}>
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
