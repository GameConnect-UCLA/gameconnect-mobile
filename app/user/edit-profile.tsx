import EditProfileView from '@/src/features/profile/components/EditProfileView'
import { useNavigation } from '@/src/core/hooks/useNavigation'

export default function EditProfileScreen() {
  const { back } = useNavigation()

  const handleSave = (data: any) => {
    console.log('Datos para guardar:', data)
    back()
  }

  return <EditProfileView onBack={() => back()} onSave={handleSave} />
}
