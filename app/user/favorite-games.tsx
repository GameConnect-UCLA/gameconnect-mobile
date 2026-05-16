import FavoriteGamesView from '@/src/components/user/favorite-games';
import { useRouter } from 'expo-router';

export default function FavoriteGamesScreen() {
  const router = useRouter();

  return (
    <FavoriteGamesView onBack={() => router.back()} />
  );
}