import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Notification, NotificationType, FollowRequestNotification, InvitationGameNotification, InvitationTeamNotification, LikeNotification, CommentNotification, MentionNotification, SuggestionNotification } from '../../../hooks/mock-data/notificaciones/notificationsMock';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onAcceptFollowRequest?: (id: string) => void;
  onRejectFollowRequest?: (id: string) => void;
  onAcceptInvitation?: (id: string) => void;
  onRejectInvitation?: (id: string) => void;
}

// Helper to format date
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `Hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `Hace ${Math.floor(interval)} meses`;
  interval = seconds / 604800;
  if (interval > 1) return `Hace ${Math.floor(interval)} semanas`;
  interval = seconds / 86400;
  if (interval > 1) return `Hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `Hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `Hace ${Math.floor(interval)} minutos`;
  return 'Hace unos segundos';
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onAcceptFollowRequest,
  onRejectFollowRequest,
  onAcceptInvitation,
  onRejectInvitation,
}) => {
  const isUnread = !notification.isRead;

  const handlePress = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    console.log(`Notification pressed: ${notification.id}`);
  };

  const renderNotificationContent = () => {
    switch (notification.type) {
      case NotificationType.FOLLOW_REQUEST:
        const frn = notification as FollowRequestNotification;
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{frn.sender.username}</Text>{' '}
            {frn.isAccepted ? 'ha comenzado a seguirte.' : 'quiere seguirte.'}
          </Text>
        );

      case NotificationType.LIKE:
        const lkn = notification as LikeNotification;
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{lkn.sender.username}</Text> Le dio me gusta a tu publicación
          </Text>
        );

      case NotificationType.COMMENT:
        const cmn = notification as CommentNotification;
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{cmn.sender.username}</Text> comentó: "{cmn.commentPreview}"
          </Text>
        );

      case NotificationType.INVITATION_GAME:
        const ign = notification as InvitationGameNotification;
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{ign.sender.username}</Text> te invitó a jugar{' '}
            <Text style={styles.highlightText}>{ign.game.name}</Text>
          </Text>
        );

      case NotificationType.INVITATION_TEAM:
        const itn = notification as InvitationTeamNotification;
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{itn.sender.username}</Text> te invitó a unirte a su equipo{' '}
            <Text style={styles.highlightText}>{itn.team.name}</Text>
          </Text>
        );

      case NotificationType.MENTION:
        const mtn = notification as MentionNotification;
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{mtn.sender.username}</Text> te mencionó en un comentario
          </Text>
        );

      case NotificationType.SUGGESTION:
        const sgn = notification as SuggestionNotification;
        return (
          <Text style={styles.notificationText}>
            Nueva sugerencia de seguimiento:{' '}
            <Text style={styles.usernameText}>{sgn.target.name}</Text>
          </Text>
        );

      default:
        return <Text style={styles.notificationText}>Notificación.</Text>;
    }
  };

  const renderRightElement = () => {
    switch (notification.type) {
      // Botón "Seguir" azul a la derecha en sugerencias
      case NotificationType.SUGGESTION:
        return (
          <TouchableOpacity style={styles.followRightButton}>
            <Text style={styles.followRightButtonText}>Seguir</Text>
          </TouchableOpacity>
        );

      // Miniaturas (Post preview) en Likes, Comentarios y Menciones
      case NotificationType.LIKE:
      case NotificationType.COMMENT:
      case NotificationType.MENTION:
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150' }} 
            style={styles.postThumbnail} 
          />
        );
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    switch (notification.type) {
      case NotificationType.INVITATION_GAME:
      case NotificationType.INVITATION_TEAM:
        const invStatus = (notification as InvitationGameNotification | InvitationTeamNotification).status;
        if (invStatus === 'pending') {
          return (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onAcceptInvitation && onAcceptInvitation(notification.id)}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => onRejectInvitation && onRejectInvitation(notification.id)}
              >
                <Text style={styles.rejectButtonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          );
        }
        return <Text style={styles.statusText}>{invStatus === 'accepted' ? 'Aceptado' : 'Rechazado'}</Text>;

      default:
        return null;
    }
  };

  const getAvatarSource = () => {
    switch (notification.type) {
      case NotificationType.SUGGESTION:
        return { uri: (notification as SuggestionNotification).target.avatar };
      default:
        return { uri: (notification as any).sender.avatar };
    }
  };

  // Renderizado del Badge/Icono sutil debajo del Avatar según el tipo (mockup)
  const renderAvatarOverlayIcon = () => {
    switch (notification.type) {
      case NotificationType.LIKE:
        return <View style={[styles.overlayIconContainer, { backgroundColor: '#FF3B30' }]}><Text style={styles.overlayIconText}>❤️</Text></View>;
      case NotificationType.COMMENT:
      case NotificationType.MENTION:
        return <View style={[styles.overlayIconContainer, { backgroundColor: '#007AFF' }]}><Text style={styles.overlayIconText}>💬</Text></View>;
      case NotificationType.INVITATION_GAME:
        return <View style={[styles.overlayIconContainer, { backgroundColor: '#FF00FF' }]}><Text style={styles.overlayIconText}>🎮</Text></View>;
      case NotificationType.INVITATION_TEAM:
        return <View style={[styles.overlayIconContainer, { backgroundColor: '#8E8E93' }]}><Text style={styles.overlayIconText}>👥</Text></View>;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarWrapper}>
        <Image source={getAvatarSource()} style={styles.avatar} />
        {renderAvatarOverlayIcon()}
      </View>

      <View style={styles.content}>
        {renderNotificationContent()}
        <Text style={styles.timeText}>{formatTimeAgo(notification.createdAt)}</Text>
        {renderActionButtons()}
      </View>

      {renderRightElement()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A', // Fondo gris oscuro del diseño
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  unreadContainer: {
    backgroundColor: '#242426', // Tono ligeramente más claro para indicar no leído
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
  },
  overlayIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
  },
  overlayIconText: {
    fontSize: 9,
    color: '#FFF',
  },
  content: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  notificationText: {
    color: '#E5E5EA',
    fontSize: 14,
    lineHeight: 18,
  },
  usernameText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  highlightText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  timeText: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  acceptButton: {
    backgroundColor: '#FF00FF', // Magenta del mockup
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#2C2C2E', // Gris oscuro del mockup
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  rejectButtonText: {
    color: '#AEAEB2',
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    color: '#8E8E93',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  followRightButton: {
    backgroundColor: '#004CB3', // Azul oscuro premium
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  followRightButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  postThumbnail: {
    width: 52,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#222',
  },
});