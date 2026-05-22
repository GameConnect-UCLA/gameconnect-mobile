import { useState, useEffect, useCallback } from 'react';
import { fetchNotificationsApi } from '../api/notifications';
import {
  Notification,
  NotificationType,
  FollowRequestNotification,
  InvitationGameNotification,
  InvitationTeamNotification,
} from './mock-data/notificaciones/notificationsMock';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNotificationsApi();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const refreshNotifications = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await fetchNotificationsApi();
      setNotifications(data);
    } catch (err) {
      setError('Failed to refresh notifications.');
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  }, []);

  const handleAcceptFollowRequest = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === id && n.type === NotificationType.FOLLOW_REQUEST
          ? { ...(n as FollowRequestNotification), isAccepted: true, isRead: true }
          : n
      )
    );
    // In a real app, this would also trigger an API call to update the backend
    console.log(`Accepted follow request: ${id}`);
  }, []);

  const handleRejectFollowRequest = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    ); // Remove from list on reject
    // In a real app, this would also trigger an API call
    console.log(`Rejected follow request: ${id}`);
  }, []);

  const handleAcceptInvitation = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        (n.id === id && n.type === NotificationType.INVITATION_GAME)
          ? { ...(n as InvitationGameNotification), status: 'accepted', isRead: true }
          : (n.id === id && n.type === NotificationType.INVITATION_TEAM)
          ? { ...(n as InvitationTeamNotification), status: 'accepted', isRead: true }
          : n
      )
    );
    console.log(`Accepted invitation: ${id}`);
  }, []);

  const handleRejectInvitation = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        (n.id === id && n.type === NotificationType.INVITATION_GAME)
          ? { ...(n as InvitationGameNotification), status: 'rejected', isRead: true }
          : (n.id === id && n.type === NotificationType.INVITATION_TEAM)
          ? { ...(n as InvitationTeamNotification), status: 'rejected', isRead: true }
          : n
      )
    );
    console.log(`Rejected invitation: ${id}`);
  }, []);


  return {
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
  };
};
