/** Post detail view component */
import type { Post } from "@/src/core/types/post.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "@/src/features/feed/components/PostCard";
import { PostComments } from "./PostComments";
import { Colors, Spacing, Radii, Typography } from "@/src/core/theme";
import { useNavigation } from "@/src/core/hooks/useNavigation";
import { usePostComments } from "@/src/features/post/hooks/usePostComments";
import { useCreateComment } from "@/src/features/post/hooks/useCreateComment";
import { useToastStore } from "@/src/core/store/toast.store";
import { useUserStore } from "@/src/core/store/user.store";

const BG_IMAGE = require("@/assets/images/bgbody.png");

/** Full post detail view with comments, image modal, and comment input */
export const PostDetailView = ({
  post,
  initialImageIndex = 0,
}: {
  post: Post;
  initialImageIndex?: number;
}) => {
  const { back } = useNavigation();
  const [commentText, setCommentText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const postId = useMemo(() => post.id, [post.id]);
  const { user } = useUserStore.getState()
  console.log(user); 
  const { data: remoteComments = [], isLoading: isCommentsLoading } =
    usePostComments(postId);
  const { mutate: createCommentMutate, isPending: isCommentPending } =
    useCreateComment(postId);
  const showToast = useToastStore((s) => s.showToast);

  const handleOpenImage = (url: string) => {
    setSelectedImageUrl(url);
    setIsImageModalVisible(true);
  };

  const handleSendComment = () => {
    if (commentText.trim().length === 0) return;
    createCommentMutate(commentText, {
      onSuccess: () => {
        setCommentText("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      },
      onError: () => {
        showToast("Error al enviar comentario", "error");
      },
    });
  };

  return (
    <ImageBackground source={BG_IMAGE} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => back()}>
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
              <PostCard
                post={post}
                hideComment
                onImagePress={handleOpenImage}
                initialImageIndex={initialImageIndex}
              />
              {post.isReview && (
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewLabel}>Reseña de:</Text>
                  <Text style={styles.reviewGame}>{post.title}</Text>
                </View>
              )}
            </View>
            {isCommentsLoading ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginTop: 30 }}
              />
            ) : (
              <PostComments comments={remoteComments} />
            )}
          </ScrollView>
        </View>

        {showSuccess && (
          <View style={styles.successToast}>
            <Text style={styles.successText}>Comentario enviado</Text>
          </View>
        )}

        <KeyboardStickyView>
          <View style={styles.inputBar}>
            <Image
              source={user?.profilePic || require("@/assets/images/default-avatar.jpg")}
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
            <TouchableOpacity
              onPress={handleSendComment}
              style={styles.sendIcon}
              disabled={isCommentPending}
            >
              <Ionicons
                name="send"
                size={26}
                color={isCommentPending ? "#AAA" : Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>

        <Modal visible={isImageModalVisible} transparent animationType="fade">
          <View style={styles.modalBg}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Ionicons name="close-circle" size={45} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter",
  },
  headerLine: {
    height: 1,
    backgroundColor: "#000",
    opacity: 0.1,
    marginHorizontal: 30,
  },
  postContent: { padding: 5 },
  reviewInfo: { marginTop: 10, paddingHorizontal: 15 },
  reviewLabel: { fontSize: Typography.sizes.md, color: "#666" },
  reviewGame: {
    fontSize: Typography.sizes.xl,
    fontWeight: "bold",
    color: "#000",
    marginTop: 2,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: "transparent",
  },
  inputAvatar: {
    width: 48,
    height: 48,
    borderRadius: Radii.xl,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  inputBubble: {
    flex: 1,
    height: 45,
    backgroundColor: "rgba(200, 200, 200, 0.7)",
    borderRadius: 25,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  textInput: { color: "#000", fontSize: 15 },
  sendIcon: { marginLeft: Spacing.md },
  successToast: {
    position: "absolute",
    bottom: 90,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    zIndex: 1000,
  },
  successText: { color: "white", fontWeight: "bold" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
  },
  closeModal: { position: "absolute", top: 50, right: 25 },
  fullImage: { width: "100%", height: "80%" },
});

export default PostDetailView;
