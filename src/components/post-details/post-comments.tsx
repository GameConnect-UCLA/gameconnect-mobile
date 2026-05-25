import { Comment } from '@/src/types/post.types';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Props {
  comments: Comment[];
}

export const PostComments: React.FC<Props> = ({ comments }) => {
  const router = useRouter(); 

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
              onPress={() => router.push(`/user/${comment.author_id}` as any)}
              style={styles.commentRow}
            >
              <Image source={{ uri: comment.author_profile_pic }} style={styles.avatar} />
              <View style={styles.bubble}>
                <Text style={styles.authorName}>{comment.author_display_name}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            </TouchableOpacity>
            
            <Text style={styles.timeText}>{comment.created_at}</Text>
            <View style={styles.itemSeparator} />
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 15, 
    marginTop: -35
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000', 
    marginBottom: 10, 
    fontFamily: 'Inter' 
  },
  headerSeparator: { 
    height: 1, 
    backgroundColor: '#000', 
    opacity: 0.2, 
    marginBottom: 20 
  },
  commentWrapper: { 
    marginBottom: 15 
  },
  commentRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  avatar: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    marginRight: 12 
  },
  bubble: { 
    flex: 1, 
    backgroundColor: '#D9D9D9', 
    padding: 12, 
    borderRadius: 18,
    borderTopLeftRadius: 5, 
  },
  authorName: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    color: '#000', 
    marginBottom: 2 
  },
  commentContent: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 18 
  },
  timeText: { 
    fontSize: 11, 
    color: '#666', 
    marginLeft: 65, 
    marginTop: 4 
  },
  itemSeparator: { 
    height: 1, 
    backgroundColor: '#000', 
    opacity: 0.1, 
    marginTop: 10 
  },
  noComments: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 10 
  }
});