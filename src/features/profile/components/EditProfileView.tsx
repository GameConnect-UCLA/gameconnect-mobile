/** Edit profile component */
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Spacing, Typography } from '@/src/core/theme'

const BG_IMAGE = require('@/assets/images/bgbody.png')

interface EditProfileViewProps {
  user: {
    display_name: string
    username: string
    email: string
    bio?: string | null
    pronouns?: string | null
    profile_pic: string
    cover_pic: string
  }
  onBack: () => void
  onSave: (data: {
    displayName: string
    username: string
    email: string
    pronouns: string
    bio: string
    newProfilePic?: string
    newCoverPic?: string
  }) => Promise<void>
  isSaving?: boolean
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onBack, onSave, isSaving }) => {
  const [name, setName] = useState(user.display_name)
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [pronouns, setPronouns] = useState(user.pronouns ?? '')
  const [bio, setBio] = useState(user.bio ?? '')
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [coverPic, setCoverPic] = useState<string | null>(null)
  const [picking, setPicking] = useState<'profile' | 'cover' | null>(null)

  const pickImage = async (target: 'profile' | 'cover') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.')
      return
    }

    setPicking(target)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: target === 'profile' ? [1, 1] : [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        if (target === 'profile') {
          setProfilePic(result.assets[0].uri)
        } else {
          setCoverPic(result.assets[0].uri)
        }
      }
    } finally {
      setPicking(null)
    }
  }

  const handleSave = async () => {
    await onSave({
      displayName: name,
      username,
      email,
      pronouns,
      bio,
      ...(profilePic ? { newProfilePic: profilePic } : {}),
      ...(coverPic ? { newCoverPic: coverPic } : {}),
    })
  }

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <ImageBackground
              source={{ uri: coverPic || user.cover_pic }}
              style={styles.coverImage}
              resizeMode="cover"
            >
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editCoverLabel}
                onPress={() => pickImage('cover')}
                disabled={isSaving || picking !== null}
              >
                {picking === 'cover' ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.editCoverText}>Editar Foto Portada</Text>
                )}
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.bigCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: profilePic || user.profile_pic }} style={styles.avatar} />
              </View>
              <TouchableOpacity
                style={styles.editAvatarLabel}
                onPress={() => pickImage('profile')}
                disabled={isSaving || picking !== null}
              >
                {picking === 'profile' ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.editAvatarText}>Editar Foto Perfil</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Nombre y Apellido</Text>
                <TextInput
                  style={styles.inputText}
                  value={name}
                  onChangeText={setName}
                  editable={!isSaving}
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Nombre de Usuario</Text>
                <TextInput
                  style={styles.inputText}
                  value={username}
                  onChangeText={setUsername}
                  editable={!isSaving}
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Correo Electrónico</Text>
                <TextInput
                  style={styles.inputText}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isSaving}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Pronombres</Text>
                <TextInput
                  style={styles.inputText}
                  value={pronouns}
                  onChangeText={setPronouns}
                  editable={!isSaving}
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Presentación</Text>
                <TextInput
                  style={[styles.inputText, styles.multilineInput]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  editable={!isSaving}
                />
              </View>

              <View style={styles.divider} />
              <TouchableOpacity style={styles.verifiedContainer}>
                <Text style={styles.verifiedText}>Muestra que tu perfil está verificado</Text>
              </TouchableOpacity>
              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  headerContainer: { height: 250, width: '100%' },
  coverImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 20, left: 15 },
  editCoverLabel: { position: 'absolute', bottom: 70, right: 15 },
  editCoverText: {
    color: 'white', fontFamily: 'Inter', fontWeight: '600',
    fontSize: Typography.sizes.md, textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 6,
  },
  bigCard: {
    backgroundColor: 'rgba(204, 204, 204, 0.85)', borderRadius: 30,
    marginHorizontal: 0, marginTop: -60, paddingBottom: 30, alignItems: 'center', zIndex: 1,
  },
  avatarWrapper: { alignItems: 'center', marginTop: -60, marginBottom: 10 },
  avatarContainer: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 4,
    borderColor: 'white', overflow: 'hidden', elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
  avatar: { width: '100%', height: '100%' },
  editAvatarLabel: { marginTop: 10 },
  editAvatarText: { fontFamily: 'Inter', fontWeight: '600', color: '#000000', fontSize: Typography.sizes.md },
  formContainer: { width: '100%', paddingHorizontal: 20 },
  inputBox: {
    backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: Spacing.lg,
    paddingVertical: 10, marginBottom: Spacing.md, width: '100%', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  inputLabel: { fontFamily: 'Inter', fontWeight: '600', fontSize: Typography.sizes.sm, color: '#000000', marginBottom: 2 },
  inputText: { fontFamily: 'Inter', fontSize: 15, color: '#000000', padding: 0 },
  multilineInput: { minHeight: 40, textAlignVertical: 'top' },
  divider: { height: 1, backgroundColor: '#000000', opacity: 0.1, marginVertical: 10 },
  verifiedContainer: { paddingVertical: 10 },
  verifiedText: { fontFamily: 'Inter', color: '#2533C8', fontWeight: '600', textAlign: 'center', fontSize: Typography.sizes.md },
  saveButton: { backgroundColor: Colors.accentLight, borderRadius: 30, height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontFamily: 'Inter', fontWeight: '600', fontSize: Typography.sizes.xl },
})

export default EditProfileView
