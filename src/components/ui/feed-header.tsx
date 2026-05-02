import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header() {

  const router = useRouter(); 
  const openChat =() => {
    alert("chat")
    router.push("/chat")
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.containerHeader}>
        {/* Logo y Nombre */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/images/headerlogo.png')} style={styles.logo} />
          <Text style={styles.title}>GameConnect</Text>
        </View>

        {/* Iconos de búsqueda y chat */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#111111" />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 15 }} onPress={openChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#111111" />
          </TouchableOpacity>

        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#666666" />
        <TextInput
          placeholder="Buscar publicaciones..."
          placeholderTextColor="#666666"
          style={styles.input}
        />
      </View>
      {/* Línea divisoria suave */}
      <View style={styles.smoothBorderline} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    backgroundColor: 'transparent', 
    paddingTop: 10 
  },
  containerHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
    gap: 70
  },
  logoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  logo: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    marginRight: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold',
    textAlignVertical: 'center',
    color: '#000000'
  },
  iconsContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#D9D9D9', // Un tono oscuro que contraste bien
    marginHorizontal: 15, 
    borderRadius: 25, 
    paddingHorizontal: 15,
    height: 50
  },
  input: { 
    marginLeft: 10, 
    flex: 1,
    color: '#111111',
    fontSize: 16
  },
  smoothBorderline:{
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  }
});