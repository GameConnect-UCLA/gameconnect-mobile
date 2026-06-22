/** Post comments list component */
import type { Comment } from '@/src/core/types/post.types'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

interface Props {
  comments: Comment[]
}

/** Display list of comments for a post @param comments Comment array @returns PostComments component */
export const PostComments: React.FC<Props> = ({ comments }) => {
  const { push } = useNavigation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios ({comments.length})</Text>
      <View style={styles.headerSeparator} />

      {comments.length === 0 ? (
        <Text style={styles.noComments}>No hay comentarios aún.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentWrapper}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => push(`/user/${comment.author_id}`)}
              style={styles.commentRow}
            >
              <Image source={{ uri: comment.author_profilePic }} style={styles.avatar} />
              <View style={styles.bubble}>
                <Text style={styles.authorName}>{comment.authorDisplayName}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.timeText}>{comment.createdAt}</Text>
            <View style={styles.itemSeparator} />
          </View>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15, marginTop: -35 },
  title: { fontSize: Typography.sizes.xl, fontWeight: 'bold', color: '#000', marginBottom: 10, fontFamily: 'Inter' },
  headerSeparator: { height: 1, backgroundColor: '#000', opacity: 0.2, marginBottom: 20 },
  commentWrapper: { marginBottom: 15 },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: Spacing.md },
  bubble: { flex: 1, backgroundColor: Colors.border, padding: Spacing.md, borderRadius: Radii.lg, borderTopLeftRadius: 5 },
  authorName: { fontWeight: 'bold', fontSize: Typography.sizes.md, color: '#000', marginBottom: 2 },
  commentContent: { fontSize: Typography.sizes.md, color: '#333', lineHeight: 18 },
  timeText: { fontSize: Typography.sizes.xs, color: '#666', marginLeft: 65, marginTop: Spacing.xs },
  itemSeparator: { height: 1, backgroundColor: '#000', opacity: 0.1, marginTop: 10 },
  noComments: { textAlign: 'center', color: '#666', marginTop: 10 },
})
