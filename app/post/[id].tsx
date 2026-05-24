import { PostDetailView } from '@/src/components/post-details/post-detail-view';
import { mockPosts } from '@/src/hooks/mock-data/mock-posts';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PostDetailRoute() {
  const { id } = useLocalSearchParams();
  
  const post = mockPosts.find(p => String(p.id) === String(id));

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Publicación no encontrada</Text>
        <Text style={{ fontSize: 12, color: '#999' }}>ID buscado: {id}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Detalle', headerTintColor: '#033563' }} />
      <PostDetailView post={post} />
    </>
  );
}