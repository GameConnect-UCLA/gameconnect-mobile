import { useMockUser } from '@/src/hooks/mock-data/useMockUser';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const BG_IMAGE = require('@/assets/images/bgbody.png');

interface EditProfileViewProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ onBack, onSave }) => {
  const user = useMockUser();

  const [name, setName] = useState(user.display_name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [pronouns, setPronouns] = useState(""); 
  const [bio, setBio] = useState(user.bio || "");

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* SECCIÓN PORTADA */}
          <View style={styles.headerContainer}>
            <ImageBackground source={{ uri: user.cover_pic }} style={styles.coverImage} resizeMode="cover">
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.editCoverLabel}>
                <Text style={styles.editCoverText}>Editar Foto Portada</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          {/* RECTÁNGULO GRANDE (Superpuesto a la portada) */}
          <View style={styles.bigCard}>
            
            {/* FOTO DE PERFIL (Ahora dentro de la card y subida con margen negativo) */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
              </View>
              {/* TEXTO DEBAJO DE LA FOTO */}
              <TouchableOpacity style={styles.editAvatarLabel}>
                 <Text style={styles.editAvatarText}>Editar Foto Perfil</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Nombre y Apellido</Text>
                <TextInput style={styles.inputText} value={name} onChangeText={setName} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Nombre de Usuario</Text>
                <TextInput style={styles.inputText} value={username} onChangeText={setUsername} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Correo Electrónico</Text>
                <TextInput style={styles.inputText} value={email} onChangeText={setEmail} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Pronombres</Text>
                <TextInput style={styles.inputText} value={pronouns} onChangeText={setPronouns} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Presentación</Text>
                <TextInput 
                  style={[styles.inputText, styles.multilineInput]} 
                  value={bio} 
                  onChangeText={setBio} 
                  multiline 
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.verifiedContainer}>
                <Text style={styles.verifiedText}>Muestra que tu perfil está verificado</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => onSave({ name, username, email, pronouns, bio })}
              >
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  
  headerContainer: { 
    height: 250, 
    width: '100%',
  },
  coverImage: { 
    width: '100%', 
    height: '100%', 
  },
  
  backButton: { position: 'absolute', top: 20, left: 15 },
  
  editCoverLabel: { position: 'absolute', bottom: 70, right: 15 },
  editCoverText: { 
    color: 'white', 
    fontFamily: 'Inter', 
    fontWeight: '600', 
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.8)', 
    textShadowRadius: 6 
  },

  bigCard: {
    backgroundColor: 'rgba(204, 204, 204, 0.85)',
    borderRadius: 30,
    marginHorizontal: 0,
    marginTop: -60,
    paddingBottom: 30,
    alignItems: 'center',
    zIndex: 1,
  },

  avatarWrapper: {
    alignItems: 'center',
    marginTop: -60, 
    marginBottom: 10,
  },
  avatarContainer: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 4, 
    borderColor: 'white', 
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatar: { width: '100%', height: '100%' },

  editAvatarLabel: { 
    marginTop: 10, 
  },
  editAvatarText: { 
    fontFamily: 'Inter', 
    fontWeight: '600', 
    color: '#000000', 
    fontSize: 14 
  },

  formContainer: { width: '100%', paddingHorizontal: 20 },
  
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputLabel: { fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: '#000000', marginBottom: 2 },
  inputText: { fontFamily: 'Inter', fontSize: 15, color: '#000000', padding: 0 },
  multilineInput: { minHeight: 40, textAlignVertical: 'top' },
  divider: { height: 1, backgroundColor: '#000000', opacity: 0.1, marginVertical: 10 },
  verifiedContainer: { paddingVertical: 10 },
  verifiedText: { fontFamily: 'Inter', color: '#2533C8', fontWeight: '600', textAlign: 'center', fontSize: 14 },
  saveButton: { backgroundColor: '#8A38F5', borderRadius: 30, height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFFFFF', fontFamily: 'Inter', fontWeight: '600', fontSize: 18 }
});

export default EditProfileView;