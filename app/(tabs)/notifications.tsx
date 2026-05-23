import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../../src/hooks/useNotifications';
import { SectionHeader } from '../../src/components/screen/notifications/SectionHeader';
import { FollowRequestsCard } from '../../src/components/screen/notifications/FollowRequestsCard';
import { NotificationItem } from '../../src/components/screen/notifications/NotificationItem';
import { NotificationType, FollowRequestNotification } from '../../src/hooks/mock-data/notificaciones/notificationsMock';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BG_IMAGE = require('../../assets/images/bgbody.png');

const CustomHeader: React.FC = () => (
  <View style={headerStyles.headerContainer}>
    <TouchableOpacity onPress={() => router.back()} style={headerStyles.backButton}>
      <Ionicons name="chevron-back" size={20} color="#000000" />
    </TouchableOpacity>
    <Text style={headerStyles.headerTitle}>Notificaciones</Text>
  </View>
);

const NotificationsScreen: React.FC = () => {
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
  } = useNotifications();

  const followRequests = notifications.filter(
    (n) => n.type === NotificationType.FOLLOW_REQUEST && !(n as FollowRequestNotification).isAccepted
  ) as FollowRequestNotification[];

  const generalNotifications = notifications.filter(
    (n) => n.type !== NotificationType.FOLLOW_REQUEST || (n as FollowRequestNotification).isAccepted
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF00FF" />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={refreshNotifications} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
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
            <>
              <CustomHeader />
              {followRequests.length > 0 && (
                <FollowRequestsCard
                  requests={followRequests}
                  onAccept={handleAcceptFollowRequest}
                  onReject={handleRejectFollowRequest}
                />
              )}
              {generalNotifications.length > 0 && (
                <SectionHeader title="Lo más destacado" />
              )}
              {generalNotifications.length > 0 && (
                <SectionHeader title="Últimos 7 días" />
              )}
            </>
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
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const headerStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    // Adjust as needed for alignment with title
  },
  headerTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 10,
    color: '#E0E0E0',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
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
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#000000',
    opacity: 0.72,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
