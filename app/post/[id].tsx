import { PostDetailView } from '@/src/features/post/components/PostDetailView'
import { fetchPostById } from '@/src/features/post/api/post.api'
import { postKeys } from '@/src/features/post/api/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'

export default function PostDetailRoute() {
  const { id, imageIndex } = useLocalSearchParams<{ id?: string; imageIndex?: string }>()
  const parsedImageIndex = Number.parseInt(imageIndex ?? '0', 10)
  const initialImageIndex = Number.isNaN(parsedImageIndex) ? 0 : parsedImageIndex

  const { data: post, isLoading, isError } = useQuery({
    queryKey: postKeys.details(id!),
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError || !post) {
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
