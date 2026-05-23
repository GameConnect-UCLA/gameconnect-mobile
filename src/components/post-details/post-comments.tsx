import { Comment } from '@/src/types/post.types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  comments: Comment[];
}

export const PostComments = ({ comments }: { comments: Comment[] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios ({comments.length})</Text>
      {comments.map((c) => (
        <View key={c.id} style={styles.commentCard}>
          <Image source={{ uri: c.author_profile_pic }} style={styles.avatar} />
          <View style={styles.content}>
            <Text style={styles.author}>{c.author_display_name}</Text>
            <Text style={styles.text}>{c.content}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#033563', 
    marginBottom: 15
  },

  commentCard: { 
    flexDirection: 'row', 
    marginBottom: 15
  },

  avatar: { 
    width: 35, 
    height: 35, 
    borderRadius: 18, 
    marginRight: 10
  },

  content: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 15, 
    elevation: 1
  },

  author: { 
    fontWeight: 'bold', 
    fontSize: 13, 
    color: '#000'
  },

  text: { 
    fontSize: 14, 
    color: '#444', 
    marginTop: 2
  }
});