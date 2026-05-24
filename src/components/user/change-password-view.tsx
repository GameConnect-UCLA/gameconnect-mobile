import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const BG_IMAGE = require('@/assets/images/bgbody.png');

export const ChangePasswordView = () => {
  const router = useRouter();
  
  // Estados para los textos
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Estados independientes para mostrar/ocultar cada contraseña
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert("Error", "Las nuevas contraseñas no coinciden.");
      return;
    }
    
    Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <ImageBackground source={BG_IMAGE} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={30} color="#000" />
              <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </View>

          {/* CONTENEDOR CENTRADO */}
          <View style={styles.centerContainer}>
            <View style={styles.card}>
              
              {/* CONTRASEÑA ACTUAL */}
              <Text style={styles.label}>Contraseña Actual</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry={!showCurrent} 
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Ionicons 
                    name={showCurrent ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              {/* NUEVA CONTRASEÑA */}
              <Text style={styles.label}>Nueva Contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry={!showNew} 
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons 
                    name={showNew ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              {/* CONFIRMAR NUEVA CONTRASEÑA */}
              <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry={!showConfirm} 
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons 
                    name={showConfirm ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              {/* BOTÓN ACTUALIZAR */}
              <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
                <Text style={styles.btnText}>Actualizar Contraseña</Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60,
    paddingBottom: 20 ,
  },
  backBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10, 
    fontFamily: 'Inter' 
  },
  centerContainer: { 
    flex: 1,  
    paddingHorizontal: 20 
  },
  card: { 
    backgroundColor: 'rgba(217, 217, 217, 0.85)', 
    borderRadius: 30, 
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: '#333',
    fontFamily: 'Inter'
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    paddingHorizontal: 10, 
    height: 55, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  input: { 
    flex: 1, 
    color: '#000',
    fontSize: 16
  },
  btn: { 
    backgroundColor: '#033563', 
    borderRadius: 30, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15,
    elevation: 3
  },
  btnText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 17,
    fontFamily: 'Inter'
  }
});