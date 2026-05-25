import { PostDetailView } from '@/src/components/post-details/post-detail-view';
import { mockPosts } from '@/src/hooks/mock-data/mock-posts';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PostDetailRoute() {
  const { id, imageIndex } = useLocalSearchParams<{ id?: string | string[]; imageIndex?: string | string[] }>();
  const parsedImageIndex = Number.parseInt(Array.isArray(imageIndex) ? imageIndex[0] ?? '0' : imageIndex ?? '0', 10);
  const initialImageIndex = Number.isNaN(parsedImageIndex) ? 0 : parsedImageIndex;
  
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const post = mockPosts.find(p => String(p.id) === String(normalizedId));

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Publicación no encontrada</Text>
        <Text style={{ fontSize: 12, color: '#999' }}>ID buscado: {normalizedId}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Detalle', headerTintColor: '#033563' }} />
      <PostDetailView post={post} initialImageIndex={initialImageIndex} />
    </>
  );
}