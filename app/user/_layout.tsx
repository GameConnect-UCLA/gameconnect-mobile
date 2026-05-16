import { Stack } from 'expo-router';

export default function ModalLayout() {
  // Configura el Stack para que las pantallas dentro de este grupo no muestren cabecera por defecto.
  return <Stack screenOptions={{ headerShown: false }} />;
}