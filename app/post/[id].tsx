import { PostDetailView } from '@/src/features/post/components/PostDetailView'
import { usePostStore } from '@/src/features/feed/store/post.store'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function PostDetailRoute() {
  const { id, imageIndex } = useLocalSearchParams<{ id?: string; imageIndex?: string }>()
  const parsedImageIndex = Number.parseInt(imageIndex ?? '0', 10)
  const initialImageIndex = Number.isNaN(parsedImageIndex) ? 0 : parsedImageIndex

  const post = usePostStore((s) => s.posts.find((p) => String(p.id) === String(id)))

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Publicación no encontrada</Text>
        <Text style={{ fontSize: 12, color: '#999' }}>ID buscado: {id}</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Detalle', headerTintColor: '#033563' }} />
      <PostDetailView post={post} initialImageIndex={initialImageIndex} />
    </>
  )
}
