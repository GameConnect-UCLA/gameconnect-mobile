/** Notifications screen with follow requests section and pull-to-refresh. */

import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@/src/core/hooks/useNavigation'
import { useNotifications } from '../hooks/useNotifications'
import { useNotificationSocket } from '../hooks/useNotificationSocket'
import { SectionHeader } from './SectionHeader'
import { FollowRequestsCard } from './FollowRequestsCard'
import { NotificationItem } from './NotificationItem'
import { NotificationType } from '../types/notifications.types'
import type { FollowRequestNotification } from '../types/notifications.types'
import { Ionicons } from '@expo/vector-icons'

const BG_IMAGE = require('../../../../assets/images/bgbody.png')

const darkenHexSlightly = (hex: string, factor = 0.88): string => {
  const cleanHex = hex.replace('#', '')
  let r = Math.floor(parseInt(cleanHex.substring(0, 2), 16) * factor)
  let g = Math.floor(parseInt(cleanHex.substring(2, 4), 16) * factor)
  let b = Math.floor(parseInt(cleanHex.substring(4, 6), 16) * factor)
  const toHex = (c: number) => c.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const CustomHeader: React.FC = () => {
  const { back } = useNavigation()
  return (
    <View style={headerStyles.headerContainer}>
      <TouchableOpacity onPress={() => back()} style={headerStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#000000" />
      </TouchableOpacity>
      <Text style={headerStyles.headerTitle}>Notificaciones</Text>
    </View>
  )
}

/** Renders notifications list with follow requests card, pull-to-refresh, and loading/error states. */
const NotificationsScreen: React.FC = () => {
  useNotificationSocket()

  const {
    notifications,
    isLoading,
    isRefreshing,
    error,
    refreshNotifications,
    markAsRead,
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
    handleAcceptInvitation,
    handleRejectInvitation,
  } = useNotifications()

  const followRequests = notifications.filter(
    (n) => n.type === NotificationType.FOLLOW && !(n as FollowRequestNotification).is_accepted,
  ) as FollowRequestNotification[]

  const generalNotifications = notifications.filter(
    (n) => n.type !== NotificationType.FOLLOW || (n as FollowRequestNotification).is_accepted,
  )

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF00FF" />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={refreshNotifications} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader />
        <View style={styles.cardContainer}>
          <FlatList
            data={generalNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem
                notification={item}
                onMarkAsRead={markAsRead}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onRejectFollowRequest={handleRejectFollowRequest}
                onAcceptInvitation={handleAcceptInvitation}
                onRejectInvitation={handleRejectInvitation}
              />
            )}
            ListHeaderComponent={
              <View style={styles.listHeaderGap}>
                {followRequests.length > 0 && (
                  <FollowRequestsCard
                    requests={followRequests}
                    onAccept={handleAcceptFollowRequest}
                    onReject={handleRejectFollowRequest}
                  />
                )}
                {generalNotifications.length > 0 && (
                  <SectionHeader title="Últimos 7 días" />
                )}
              </View>
            }
            ListEmptyComponent={
              (!isLoading && !isRefreshing) ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No tienes notificaciones.</Text>
                </View>
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshNotifications}
                tintColor="#9b1999"
                colors={['#9b1999', '#033563']}
                progressBackgroundColor="#ffffff"
              />
            }
            contentContainerStyle={styles.listContentContainer}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
  },
})

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: darkenHexSlightly('#d9d9d9', 0.95),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  loadingText: {
    marginTop: 10,
    color: '#E0E0E0',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3D00',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FF00FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  listContentContainer: {
    marginHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 40,
  },
  listHeaderGap: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#000000',
    opacity: 0.6,
    fontSize: 16,
    textAlign: 'center',
  },
})

export default NotificationsScreen
