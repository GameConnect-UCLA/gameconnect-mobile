import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FollowRequestNotification } from '../../../hooks/mock-data/notificaciones/notificationsMock';
import { Ionicons } from '@expo/vector-icons';

interface FollowRequestsCardProps {
  requests: FollowRequestNotification[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const FollowRequestsCard: React.FC<FollowRequestsCardProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) {
    return null;
  }

  const firstRequest = requests[0];
  const secondRequest = requests.length > 1 ? requests[1] : null;
  const remainingCount = requests.length > 2 ? requests.length - 2 : 0;

  const subtitleText = (
    secondRequest
      ? `${firstRequest.sender.username}, ${secondRequest.sender.username}`
      : `${firstRequest.sender.username}`
  ) + (remainingCount > 0 ? ` + ${remainingCount} mas` : '');

  const handleAcceptAll = () => {
    requests.forEach((req) => onAccept(req.id));
  };

  const handleRejectAll = () => {
    requests.forEach((req) => onReject(req.id));
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.contentWrapper} onPress={() => console.log('View all follow requests')}>
        <View style={styles.header}>
          <View style={styles.avatarStack}>
            <Image source={{ uri: firstRequest.sender.avatar }} style={styles.avatar} />
            {secondRequest && (
              <Image source={{ uri: secondRequest.sender.avatar }} style={[styles.avatar, styles.secondAvatar]} />
            )}
            {remainingCount > 0 && (
              <View style={[styles.badge, secondRequest ? styles.badgeOffset : {}]}>
                <Text style={styles.badgeText}>+{remainingCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Solicitudes de seguidores</Text>
            <Text style={styles.subtitle}>{subtitleText}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptAll}>
          <Text style={styles.acceptButtonText}>Aceptar todo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={handleRejectAll}>
          <Text style={styles.rejectButtonText}>Rechazar todo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderColor: '#3A3A3C',
    borderWidth: 1,
    overflow: 'hidden',
  },
  contentWrapper: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    position: 'relative',
    width: 60, // Adjust this based on avatar size and overlap
    height: 40,
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  secondAvatar: {
    left: 20, // Overlap effect
    top: 0,
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF00FF', // Accent color
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    zIndex: 2,
  },
  badgeOffset: {
    right: -5, // Further offset if there's a second avatar
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#3A3A3C',
    borderTopWidth: 1,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
  },
  acceptButton: {
    backgroundColor: '#007AFF', // Blue for accept
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: '#2C2C2E', // Grey for reject
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#8E8E93',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
