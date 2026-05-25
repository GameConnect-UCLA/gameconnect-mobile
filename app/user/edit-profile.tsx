// app/user/edit-profile.tsx
import EditProfileView from '@/src/components/user/edit-profile';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const router = useRouter();

  const handleSave = (data: any) => {
    console.log("Datos para guardar:", data);
    router.back(); 
  };

  return (
    <EditProfileView 
      onBack={() => router.back()} 
      onSave={handleSave} 
    />
  );
}