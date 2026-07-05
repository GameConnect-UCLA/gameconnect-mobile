/** New group creation screen with name, picture, and member selection */
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { createGroup } from '../api/chat.api'
import { useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/src/core/store/toast.store'
import { useNavigation } from '@/src/core/hooks/useNavigation'

const BG = require('@/assets/images/bgbody.png')

/** Group creation screen: set name/picture, select 2+ members, create group */
export default function NewGroupScreen() {
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const { back, replace } = useNavigation()
  const [groupName, setGroupName] = useState('')
  const [groupPic, setGroupPic] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const showToast = useToastStore((s) => s.showToast)

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const pickGroupPic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setGroupPic(result.assets[0].uri)
    }
  }

  const handleCreate = async () => {
    const trimmedName = groupName.trim()

    if (trimmedName.length === 0) {
      showToast('Group name is required.', 'warning')
      return
    }
    if (trimmedName.length > 30) {
      showToast('Group name must be 30 characters or less.', 'warning')
      return
    }
    if (selectedIds.length < 2) {
      showToast('Select at least 2 members.', 'warning')
      return
    }

    setIsCreating(true)
    try {
      const newConvo = await createGroup(trimmedName, groupPic, selectedIds)
      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
      replace(`/chat/${newConvo.id}`)
    } catch {
      showToast('Failed to create group. Please try again.', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <ImageBackground style={styles.safe} source={BG}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => back()}>
            <Ionicons name="close" size={28} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Group</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.picSection}>
            <TouchableOpacity onPress={pickGroupPic}>
              <View style={styles.avatarCircle}>
                {groupPic ? (
                  <Image source={{ uri: groupPic }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="camera-outline" size={32} color="#999" />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.picLabel}>Group Picture</Text>
          </View>

          <View style={styles.glassCard}>
            <TextInput
              style={styles.nameInput}
              placeholder="Group name"
              placeholderTextColor="#999"
              value={groupName}
              onChangeText={setGroupName}
              maxLength={30}
            />
            <Text style={styles.charCount}>{groupName.length}/30</Text>
          </View>

          <Text style={styles.sectionTitle}>Members ({selectedIds.length}/2+)</Text>
          <View style={styles.glassCard}>
            {([] as any[]).map((user) => {
              const isSelected = selectedIds.includes(user.id)
              return (
                <TouchableOpacity
                  key={user.id}
                  style={styles.memberRow}
                  onPress={() => toggleMember(user.id)}
                >
                  <Image source={{ uri: user.profilePic ?? undefined }} style={styles.memberAvatar} />
                  <Text style={styles.memberName}>{user.username}</Text>
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={isSelected ? '#033563' : '#999'}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { bottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={[
              styles.createButton,
              (isCreating || groupName.trim().length === 0 || selectedIds.length < 2) &&
                styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={isCreating}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? 'Creating...' : 'Create Group'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  picSection: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarImage: { width: 96, height: 96, borderRadius: 48 },
  picLabel: { fontSize: 13, color: '#666' },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  nameInput: { fontSize: 16, color: '#1a1a1a', paddingVertical: 8 },
  charCount: { fontSize: 12, color: '#999', textAlign: 'right' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 12 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc' },
  memberName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginLeft: 12 },
  bottomBar: { position: 'absolute', left: 20, right: 20 },
  createButton: { backgroundColor: '#033563', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  createButtonDisabled: { opacity: 0.5 },
  createButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
