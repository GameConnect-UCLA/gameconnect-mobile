/** Main chat list screen with active users and conversations */
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import ActiveAvatar from '../components/conversation-list/ActiveAvatar'
import ConversationRow from '../components/conversation-list/ConversationRow'
import ConversationActionsSheet from '../components/chat-info/ConversationActionsSheet'
import NewConversationModal from '../components/conversation-list/NewConversationModal'
import SearchBar from '@/src/core/components/SearchBar'
import { useChatSearch } from '../hooks/useChatSearch'
import { useConversations } from '../hooks/useConversations'
import { useChatStore } from '../store/chat.store'
import { leaveGroup, getCurrentUserId, startConversation } from '../api/chat.api'

import { GroupRole } from '../types/chat.types'
import type { Conversation } from '../types/chat.types'
import { useConfirmDialog } from '@/src/core/hooks/useConfirmDialog'
import { useToastStore } from '@/src/core/store/toast.store'
import { useNavigation } from '@/src/core/hooks/useNavigation'

const BG = require('@/assets/images/bgbody.png')

/** Chat list screen with active users row, search, conversation rows, and FAB */
export default function ChatListScreen() {
  const { conversations } = useConversations()
  const hideConversation = useChatStore((s) => s.hideConversation)
  const hiddenConversationIds = useChatStore((s) => s.hiddenConversationIds)
  const visibleActiveUsers: any[] = []
  const { push, back } = useNavigation()
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
  const [showActions, setShowActions] = useState(false)
  const [showNewConvo, setShowNewConvo] = useState(false)
  const { confirm } = useConfirmDialog()
  const showToast = useToastStore((s) => s.showToast)

  const handleLongPress = (c: Conversation) => {
    setSelectedConvo(c)
    setShowActions(true)
  }

  const handleOpenChat = () => {
    if (!selectedConvo) return
    setShowActions(false)
    push(`/chat/${selectedConvo.id}`)
  }

  const handleMute = () => {
    setShowActions(false)
    showToast('Mute Notifications: coming soon.', 'info')
  }

  const handleReport = () => {
    setShowActions(false)
    showToast('Report: coming soon.', 'info')
  }

  const handleDelete = async () => {
    if (!selectedConvo) return
    const isGroup = selectedConvo.isGroup
    const currentUserId = getCurrentUserId()
    const isOwner = selectedConvo.members?.some(
      (m) => m.userId === currentUserId && m.role === GroupRole.OWNER,
    )
    const label = isGroup ? (isOwner ? 'Delete Group' : 'Leave Group') : 'Delete Chat'
    const message = isGroup
      ? `Are you sure you want to ${isOwner ? 'delete this group' : 'leave this group'}?`
      : 'Delete this conversation?'

    const ok = await confirm({
      title: label,
      message,
      confirmText: label,
    })
    if (ok) {
      if (isGroup) {
        try {
          await leaveGroup(selectedConvo.id)
        } catch {
          // mock — ignore
        }
      }
      hideConversation(selectedConvo.id)
      setShowActions(false)
    }
  }

  const { query, setQuery, localResults, remoteResults, isSearching, isFiltering } =
    useChatSearch(conversations)

  return (
    <ImageBackground style={styles.safe} source={BG}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => back()}
          >
            <Text style={styles.headerBack}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mensajes</Text>

          <TouchableOpacity
            style={styles.headerBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => push('/chat/newgroup')}
          >
            <Ionicons
              name="people-circle"
              size={styles.groupIcon.width}
              color={styles.groupIcon.backgroundColor}
            />
          </TouchableOpacity>
        </View>

        <SearchBar value={query} onChangeText={setQuery} placeholder="Search chats..." />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {!isFiltering && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activos Ahora</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.activeList}
              >
                {visibleActiveUsers.map((u) => (
                  <ActiveAvatar
                    key={u.id}
                    user={u}
                    onPress={() => push(`/chat/${u.conversationId}`)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {!isFiltering && <View style={styles.divider} />}

          {localResults.length > 0 ? (
            <View style={styles.convoList}>
              {isFiltering && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Conversaciones</Text>
                </View>
              )}
              {localResults.map((c) => (
                <ConversationRow
                  key={c.id}
                  item={c}
                  onPress={() => push(`/chat/${c.id}`)}
                  onLongPress={() => handleLongPress(c)}
                />
              ))}
            </View>
          ) : (
            isFiltering &&
            !isSearching &&
            remoteResults.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No se encontraron conversaciones con &ldquo;{query}&rdquo;
                </Text>
              </View>
            )
          )}

          {!isFiltering && localResults.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#999" />
              <Text style={styles.emptyTitle}>No chats yet</Text>
              <Text style={styles.emptySubtitle}>
                Search above or start a new conversation with a gamer!
              </Text>
            </View>
          )}

          {isFiltering && (isSearching || remoteResults.length > 0) && (
            <View style={styles.convoList}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Usuarios</Text>
              </View>
              {isSearching ? (
                <ActivityIndicator size="small" color="#033563" />
              ) : (
                remoteResults.map((u) => (
                  <ConversationRow
                    key={u.id}
                    item={u}
                    onPress={async () => {
                      try {
                        const conversation = await startConversation(u.id)
                        push(`/chat/${conversation.id}`)
                      } catch (err) {
                        console.error('Failed to start conversation:', err)
                      }
                    }}
                  />
                ))

              )}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.7}
          onPress={() => setShowNewConvo(true)}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <ConversationActionsSheet
          visible={showActions}
          conversation={selectedConvo}
          onClose={() => setShowActions(false)}
          onOpenChat={handleOpenChat}
          onMute={handleMute}
          onReport={handleReport}
          onDelete={handleDelete}
        />
        <NewConversationModal
          visible={showNewConvo}
          onClose={() => setShowNewConvo(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  )
}

const TEXT_PRIMARY = '#111'
const DIVIDER = 'rgba(0,0,0,0.08)'

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerBack: { fontSize: 32, color: TEXT_PRIMARY, marginTop: -4, lineHeight: 36 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: TEXT_PRIMARY, letterSpacing: 0.2 },
  groupIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#033563',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  section: { paddingHorizontal: 6, paddingTop: 8, paddingBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 14 },
  activeList: { gap: 20, paddingRight: 4 },
  divider: { height: 1, backgroundColor: DIVIDER, marginHorizontal: 0 },
  convoList: { paddingTop: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#033563',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  noResultsContainer: { padding: 40, alignItems: 'center' },
  noResultsText: { fontSize: 15, color: '#666', textAlign: 'center' },
})
