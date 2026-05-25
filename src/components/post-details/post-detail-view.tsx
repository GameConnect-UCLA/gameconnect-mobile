import { Post } from '@/src/types/post.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import PostCard from '../posts/post-card';
import { PostComments } from './post-comments';

const BG_IMAGE = require('@/assets/images/bgbody.png');
const FOTO_JORGE = 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg';

export const PostDetailView = ({ post }: { post: Post }) => {
  const router = useRouter(); 
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post.comments);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleOpenImage = (url: string) => {
    setSelectedImageUrl(url);
    setIsImageModalVisible(true);
  };

  const handleSendComment = () => {
    if (commentText.trim().length === 0) return;
    const newComment = {
      id: Math.random().toString(),
      author_id: 'jorge-id',
      author_display_name: 'Jorge Silva',
      author_profile_pic: FOTO_JORGE,
      content: commentText,
      created_at: 'Ahora mismo'
    };
    setLocalComments([...localComments, newComment]);
    setCommentText('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <ImageBackground source={BG_IMAGE} style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          
          {/* HEADER */}
          <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Publicación</Text>
            <View style={{ width: 28 }} /> 
          </View>
          <View style={styles.headerLine} />

          <View style={{ flex: 1 }}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <View style={styles.postContent}>
                <PostCard post={post} onImagePress={handleOpenImage} />
                {post.is_review && (
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewLabel}>Reseña de:</Text>
                    <Text style={styles.reviewGame}>{post.reviewed_game}</Text>
                  </View>
                )}
              </View>

              <PostComments comments={localComments} />
            </ScrollView>
          </View>

          {/* COMENTARIO */}
          {showSuccess && (
            <View style={styles.successToast}>
              <Text style={styles.successText}>Comentario enviado</Text>
            </View>
          )}

          {/* 3. BARRA DE ENTRADA */}
          <View style={styles.inputBar}>
            <Image 
              source={{ uri: FOTO_JORGE }} 
              style={styles.inputAvatar} 
            />
            
            <View style={styles.inputBubble}>
              <TextInput 
                style={styles.textInput} 
                placeholder="Escribe un comentario..." 
                value={commentText} 
                onChangeText={setCommentText}
                placeholderTextColor="#555" 
              />
            </View>

            <TouchableOpacity onPress={handleSendComment} style={styles.sendIcon}>
              <Ionicons name="send" size={26} color="#033563" />
            </TouchableOpacity>
          </View>

          {/* MODAL PARA ZOOM */}
          <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalBg}>
              <TouchableOpacity style={styles.closeModal} onPress={() => setIsImageModalVisible(false)}>
                <Ionicons name="close-circle" size={45} color="white" />
              </TouchableOpacity>
              <Image source={{ uri: selectedImageUrl }} style={styles.fullImage} resizeMode="contain" />
            </View>
          </Modal>

        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  topHeader: { 
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 45 : 10,
    paddingBottom: 20 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000', 
    fontFamily: 'Inter' 
  },
  headerLine: { 
    height: 1, 
    backgroundColor: '#000', 
    opacity: 0.1, 
    marginHorizontal: 30 
  },
  postContent: { 
    padding: 5 
  },
  reviewInfo: { 
    marginTop: 10, 
    paddingHorizontal: 15 
  },
  reviewLabel: { 
    fontSize: 14, 
    color: '#666' 
  },
  reviewGame: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000', 
    marginTop: 2 
  },
  
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: 'transparent',
  },
  inputAvatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  inputBubble: {
    flex: 1,
    height: 45,
    backgroundColor: 'rgba(200, 200, 200, 0.7)', 
    borderRadius: 25,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  textInput: { 
    color: '#000', 
    fontSize: 15 
  },
  sendIcon: {
    marginLeft: 12,
  },

  successToast: { 
    position: 'absolute', 
    bottom: 90, 
    backgroundColor: '#033563', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    alignSelf: 'center', 
    zIndex: 1000 
  },
  successText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  modalBg: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center' 
  },
  closeModal: { 
    position: 'absolute', 
    top: 50, 
    right: 25 
  },
  fullImage: { 
    width: '100%', 
    height: '80%' 
  }
});

export default PostDetailView;