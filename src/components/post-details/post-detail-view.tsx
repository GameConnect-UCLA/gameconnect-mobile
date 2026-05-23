import { Post } from '@/src/types/post.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView, Modal, Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import PostCard from '../posts/post-card';

const BG_IMAGE = require('@/assets/images/bgbody.png');

export const PostDetailView = ({ post }: { post: Post }) => {
  const router = useRouter(); 
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post.comments);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados para el Zoom de Imagen
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleOpenImage = (url: string) => {
    setSelectedImageUrl(url);
    setIsImageModalVisible(true);
  };

  const handleSendComment = () => {
    if (commentText.trim().length === 0) return;

    const newCommentObj = {
      id: Math.random().toString(),
      author_display_name: 'JORGE SILVA',
      author_profile_pic: 'https://img.freepik.com/fotos-premium/joven-jugador-jugando-videojuegos-computadora-habitacion-oscura-luces-neon_23315-4123.jpg',
      content: commentText,
      created_at: 'Ahora mismo'
    };

    setLocalComments([...localComments, newCommentObj]);
    setCommentText('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <ImageBackground source={BG_IMAGE} style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          
          {/* BOTÓN REGRESAR */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 150 }} 
          >
            {/* POST CARD */}
            <View style={styles.postContainer}>
              <PostCard post={post} onImagePress={handleOpenImage} />
            </View>

            {/* COMENTARIOS */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentTitle}>Conversación</Text>
              
              {localComments.map((c) => (
                <View key={c.id} style={styles.commentCard}>
                  <Image source={{ uri: c.author_profile_pic }} style={styles.commentAvatar} />
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentAuthor}>{c.author_display_name}</Text>
                    <Text style={styles.commentContent}>{c.content}</Text>
                  </View>
                </View>
              ))}
              
              {localComments.length === 0 && (
                <Text style={styles.noComments}>No hay comentarios aún.</Text>
              )}
            </View>
          </ScrollView>

          {/* ZOOM PARA IMAGEN */}
          <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalBg}>
              <TouchableOpacity style={styles.closeModal} onPress={() => setIsImageModalVisible(false)}>
                <Ionicons name="close-circle" size={45} color="white" />
              </TouchableOpacity>
              <Image source={{ uri: selectedImageUrl }} style={styles.fullImage} resizeMode="contain" />
            </View>
          </Modal>

          {/* MENSAJE DE ÉXITO */}
          {showSuccess && (
            <View style={styles.successToast}>
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text style={styles.successText}>Comentario enviado</Text>
            </View>
          )}

          {/* BARRA PARA COMENTAR*/}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              value={commentText}
              onChangeText={setCommentText}
              placeholderTextColor="#666" 
            />
            <TouchableOpacity 
              onPress={handleSendComment}
              style={styles.sendIcon}
            >
              <Ionicons name="send" size={24} color="#033563" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: { 
    paddingHorizontal: 15,
    paddingTop: 10,
    marginTop: 65, 
    marginBottom: 0, 
  },
  commentsSection: {
    backgroundColor: 'rgba(217, 217, 217, 0.85)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 300,
    marginTop: -25,
  },
  commentTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#033563', 
    marginBottom: 20, 
    fontFamily: 'Inter'
  },
  commentCard: { 
    flexDirection: 'row', 
    marginBottom: 10
  },
  commentAvatar: { 
    width: 35, 
    height: 35, 
    borderRadius: 18, 
    marginRight: 10
  },
  commentBubble: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    padding: 12, 
    borderRadius: 15, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  commentAuthor: { 
    fontWeight: 'bold', 
    fontSize: 13, 
    color: '#000'
  },
  commentContent: { 
    fontSize: 14, 
    color: '#333', 
    marginTop: 2
  },
  noComments: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 20, 
    fontStyle: 'italic'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopColor: '#EEE',
    position: 'absolute',
    bottom: 50, 
    width: '92%', 
    alignSelf: 'center', 
    borderRadius: 30, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  input: { 
    flex: 1, 
    height: 40, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    color: '#000',
    fontSize: 15
  },
  sendIcon: { 
    marginLeft: 5, 
    padding: 5
  },

  successToast: {
    position: 'absolute',
    bottom: 110, 
    backgroundColor: 'rgba(3, 53, 99, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
    gap: 8,
    elevation: 5,
    zIndex: 1000
  },
  successText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  },
  modalBg: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center'
  },
  closeModal: { 
    position: 'absolute', 
    top: 50, 
    right: 25, 
    zIndex: 20
  },
  fullImage: { 
    width: '100%', 
    height: '80%'
  }
});

export default PostDetailView;