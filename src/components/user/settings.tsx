import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BG_IMAGE = require('@/assets/images/bgbody.png');

// Componentes para los items
const SettingsItem = ({ 
  icon, 
  title, 
  subtext, 
  hasSwitch = false, 
  isEnabled = false, 
  onToggle,
  onPress,
  isDestructive = false 
}: any) => {
  const content = (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={isDestructive ? "#D11D3B" : "#111"} 
          style={styles.itemIcon} 
        />
        <View>
          <Text style={[styles.itemTitle, isDestructive && { color: '#D11D3B' }]}>{title}</Text>
          {subtext && <Text style={styles.itemSubtext}>{subtext}</Text>}
        </View>
      </View>
      {hasSwitch ? (
        <Switch
          trackColor={{ false: '#D1D1D1', true: '#033563' }}
          thumbColor={isEnabled ? '#FFFFFF' : '#f4f3f4'}
          onValueChange={onToggle}
          value={isEnabled}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      )}
    </View>
  );

  if (hasSwitch) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      {content}
    </TouchableOpacity>
  );
};

export const SettingsView = () => {
  const router = useRouter();
  
  const [birthVisible, setBirthVisible] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);

  const [volumeLevel, setVolumeLevel] = useState('Alto');
  const [language, setLanguage] = useState('Español');

  // 1. VOLUMEN
  const handleVolume = () => {
    Alert.alert("Ajuste de Sonido", "¿Deseas silenciar los efectos de la app?", [
        { text: "No" },
        { text: "Sí, silenciar", onPress: () => setVolumeLevel('Silenciado') }
    ]);
  };

  // 2. CERRAR SESION
  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estas seguro de que quieres salir de tu cuenta?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: () => router.replace('/(auth)/login') }
    ]);
  };

  // 3. ELIMINAR CUENTA 
  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "Esta acción es permanente y borrará todos tus datos. ¿Quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => console.log("Cuenta eliminada") }
      ]
    );
  };

  // 4. CERRAR SESION EN TODAS LAS CUENTAS
  const handleLogoutAll = () => {
    Alert.alert(
      "Cerrar sesion en todas las cuentas", 
      "Se cerrará sesión en todos tus dispositivos. ¿Quieres Continuar?", 
      [
        { text: "Cancelar" },
        { text: "Cerrar en todos", style: "destructive", onPress: () => router.replace('/(auth)/login') }
      ]
    );
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
             <Ionicons name="chevron-back" size={28} color="#000" />
             <Text style={styles.headerTitle}>Ajustes</Text>
          </TouchableOpacity>
        </View>
       <View style={styles.headerLine} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCard}>
            
            <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={20} color="#000" />
                <Text style={styles.sectionTitle}>Ajuste de Cuenta</Text>
            </View>
            <View style={styles.sectionCard}>
              <SettingsItem 
                icon="lock-closed-outline" 
                title="Contraseña" 
                subtext="Cambiar contraseña"
                onPress={() => router.push('/user/change-password')}
              />
              <View style={styles.innerSeparator} />
              <SettingsItem icon="calendar-outline" title="Fecha de Nacimiento" hasSwitch isEnabled={birthVisible} onToggle={() => setBirthVisible(!birthVisible)} />
            </View>

            <View style={styles.sectionHeader}>
                <Ionicons name="globe-outline" size={20} color="#000" />
                <Text style={styles.sectionTitle}>Preferencias</Text>
            </View>
            <View style={styles.sectionCard}>
              <SettingsItem icon="notifications-outline" title="Notificación" subtext="Alertas y avisos" hasSwitch isEnabled={notifEnabled} onToggle={() => setNotifEnabled(!notifEnabled)} />
              <View style={styles.innerSeparator} />
              <SettingsItem 
                icon="volume-high-outline" 
                title="Sonidos" 
                subtext={`Efectos: ${volumeLevel}`} 
                onPress={handleVolume} 
              />
              <View style={styles.innerSeparator} />
              <SettingsItem icon="eye-outline" title="Privacidad de la Cuenta" hasSwitch isEnabled={privacyEnabled} onToggle={() => setPrivacyEnabled(!privacyEnabled)} />
              <View style={styles.innerSeparator} />
              <SettingsItem 
                icon="language-outline" 
                title="Idioma" 
                subtext={language}
                onPress={() => Alert.alert("Idioma", "Seleccionado: Español")}
              />
            </View>

            <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#000" />
                <Text style={styles.sectionTitle}>Seguridad y Soporte</Text>
            </View>
            <View style={styles.sectionCard}>
              <SettingsItem icon="shield-outline" title="Privacidad y Seguridad" onPress={() => Alert.alert("Info", "Tu cuenta está protegida.")} />
              <View style={styles.innerSeparator} />
              <SettingsItem icon="mail-outline" title="Centro de Ayuda" onPress={() => Alert.alert("Soporte", "Contacto: soporte@gameconnect.com")} />
              <View style={styles.innerSeparator} />
              <SettingsItem 
                icon="log-out-outline" 
                title="Cerrar Sesion en Todas las Cuentas" 
                onPress={handleLogoutAll} 
              />
              <View style={styles.innerSeparator} />
              <SettingsItem icon="trash-outline" title="Eliminar Cuenta" isDestructive onPress={handleDeleteAccount} />
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { 
    flexDirection: 'row', 
    alignItems: 'center'
},
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 5, 
    color: '#000'
},
  headerLine: { 
    height: 1, 
    backgroundColor: '#000', 
    opacity: 0.1, 
    marginHorizontal: 20
},
  scrollContent: { 
    padding: 15, 
    paddingBottom: 20
},
  
  mainCard: {
    backgroundColor: 'rgba(217, 217, 217, 0.85)',
    borderRadius: 35,
    padding: 20,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10, 
    marginTop: 5, 
    gap: 8
},
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000'
},
  
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  itemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15, flex: 1
},
  itemIcon: { 
    width: 25
},
  itemTitle: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#000'
},
  itemSubtext: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 2
},
  innerSeparator: { 
    height: 1, 
    backgroundColor: '#EEE', 
    marginHorizontal: 15
},

  logoutBtn: {
    backgroundColor: '#033563',
    borderRadius: 30,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold'
}
});