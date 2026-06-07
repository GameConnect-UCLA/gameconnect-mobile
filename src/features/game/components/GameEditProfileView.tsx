/** Game edit profile component */
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { GameProfile } from '../types/game.types'
import { Colors, Spacing, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'
import { useToastStore } from '@/src/core/store/toast.store'

interface Props {
  game: GameProfile
}

/** Game edit profile screen with cover, title, and description fields @param game GameProfile data @returns GameEditProfileView component */
export default function GameEditProfileView({ game }: Props) {
  const { back } = useNavigation()
  const showToast = useToastStore((s) => s.showToast)

  return (
    <ImageBackground source={require('@/assets/images/bgbody.png')} style={styles.background}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroWrap}>
            <Image source={{ uri: game.cover_url }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <TouchableOpacity onPress={() => back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.profileHeader}>
              <Text style={styles.pageTitle}>Editar datos del juego</Text>
              <Text style={styles.pageSubtitle}>
                Ajusta la portada, el título y la descripción desde esta pantalla.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Portada del juego</Text>
              <View style={styles.coverEditor}>
                <Image source={{ uri: game.cover_url }} style={styles.coverPreview} />
                <View style={styles.coverMeta}>
                  <Text style={styles.coverTitle}>{game.title}</Text>
                  <Text style={styles.coverHint}>{game.developer}</Text>
                  <View style={styles.coverBadgeRow}>
                    <View style={styles.coverBadge}>
                      <Ionicons name="cloud-upload-outline" size={14} color="#25508C" />
                      <Text style={styles.coverBadgeText}>Cambiar portada</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Título</Text>
              <View style={styles.inputShell}>
                <TextInput
                  defaultValue={game.title}
                  style={styles.input}
                  placeholder="Nombre del juego"
                  placeholderTextColor="#8A8A8A"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Descripción</Text>
              <View style={[styles.inputShell, styles.multilineShell]}>
                <TextInput
                  defaultValue={game.description}
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Describe el juego"
                  placeholderTextColor="#8A8A8A"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.footerDivider} />

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.9} onPress={() => showToast('Cambios guardados correctamente.', 'success')}>
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  content: { paddingBottom: 28 },
  heroWrap: { height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 10,
    zIndex: 3,
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  card: {
    marginTop: -28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(228, 228, 228, 0.96)',
    paddingHorizontal: Spacing.lg,
    paddingTop: 18,
    paddingBottom: Spacing.xl,
    minHeight: 540,
  },
  profileHeader: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    marginBottom: Spacing.lg,
  },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#073B67' },
  pageSubtitle: { marginTop: 6, color: '#555555', fontSize: Typography.sizes.md, lineHeight: 20 },
  section: { marginBottom: Spacing.lg },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: Colors.text.primary, marginBottom: 10 },
  coverEditor: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 22,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(8,62,109,0.12)',
  },
  coverPreview: { width: 98, height: 78, borderRadius: 16 },
  coverMeta: { flex: 1, paddingRight: Spacing.xs },
  coverTitle: { fontSize: Typography.sizes.lg, fontWeight: '800', color: '#0A3560' },
  coverHint: { marginTop: Spacing.xs, color: '#5E5E5E', fontSize: Typography.sizes.sm },
  coverBadgeRow: { marginTop: 10 },
  coverBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(191, 220, 255, 0.72)',
  },
  coverBadgeText: { color: '#25508C', fontSize: 12, fontWeight: '700' },
  inputShell: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 14,
    paddingVertical: Spacing.xs,
  },
  multilineShell: { paddingTop: 10, paddingBottom: Spacing.md },
  input: { minHeight: 52, color: Colors.text.primary, fontSize: 15, fontWeight: '600' },
  multilineInput: { minHeight: 122, textAlignVertical: 'top', fontWeight: '500', lineHeight: 22 },
  footerDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.12)', marginTop: Spacing.sm, marginBottom: 18 },
  saveButton: {
    height: 54,
    borderRadius: 999,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
})
