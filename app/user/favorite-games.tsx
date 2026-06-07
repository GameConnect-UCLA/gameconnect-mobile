import FavoriteGamesView from '@/src/features/profile/components/FavoriteGamesView'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function FavoriteGamesScreen() {
  const { back } = useNavigation()

  return <FavoriteGamesView onBack={() => back()} />
}
