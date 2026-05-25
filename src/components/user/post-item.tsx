import { usePostStore } from '@/src/store/post.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface PostItemProps {
  id: string; 
  userName: string;
  userTag: string;
  userAvatar: string;
  title: string;
  content: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

export const PostItem: React.FC<PostItemProps> = ({ 
  id, userName, userTag, userAvatar, title, content, imageUrl, likes, comments 
}) => {
  const router = useRouter();
  const toggleFavorite = usePostStore((state) => state.toggleFavorite);
  const favoriteIds = usePostStore((state) => state.favoriteIds);
  const isSaved = favoriteIds.includes(id);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    await Share.share({ message: `Mira este post sobre ${title}` });
  };

  const goToDetail = () => {
    router.push(`/post/${id}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userTag}>{userTag}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.postContent}>{content}</Text>
      </View>

      <Image source={{ uri: imageUrl }} style={styles.postImage} />

      <View style={styles.footerRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={26} color={liked ? "#D11D3B" : "black"} />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={goToDetail} 
          >
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.actionText}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-social-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* 3. BOTÓN DE FAVORITO */}
        <TouchableOpacity onPress={() => toggleFavorite(id)}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={26} 
            color={isSaved ? "#E8C339" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    marginTop: 25
  },

  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8
  },

  avatar: { width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    marginRight: 10
  },

  userName: { 
    fontFamily: 'Inter', 
    fontWeight: '700', 
    fontSize: 16
  },

  userTag: { 
    fontFamily: 'Inter', 
    fontSize: 13, 
    color: '#666'
  },
  
  postTitle: { 
    fontFamily: 'Inter', 
    fontWeight: '800', 
    fontSize: 17, 
    marginTop: 5
  },

  postContent: { 
    fontFamily: 'Inter', 
    fontSize: 14, 
    color: '#000', 
    marginVertical: 6, 
    textAlign: 'justify'
  },

  postImage: { 
    width: '100%', 
    height: 210, 
    borderRadius: 10
  },

  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12, 
    paddingHorizontal: 5
  },

  leftActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 18
  },

  actionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5
  },

  actionText: { 
    fontFamily: 'Inter', 
    fontSize: 15, 
    fontWeight: '500'
  }
});