import { Notification, mockNotifications } from '../hooks/mock-data/notificaciones/notificationsMock';

const NOTIFICATION_FETCH_DELAY = 800;

export const fetchNotificationsApi = (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications);
    }, NOTIFICATION_FETCH_DELAY);
  });
};
