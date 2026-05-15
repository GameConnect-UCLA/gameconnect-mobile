import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { mockGameProfiles } from '@/src/hooks/mock-data/mock-game';
import { mockUser } from '@/src/hooks/mock-data/mock-user';
import { usePostStore } from '@/src/store/post.store';
import { useToastStore } from '@/src/store/toast.store';
import type { Post } from '@/src/types/post.types';

type FieldError = {
  title: boolean;
  description: boolean;
  tags: boolean;
  rating: boolean;
};

type FieldKey = 'title' | 'description' | 'tags' | 'rating';

const emptyErrors: FieldError = {
  title: false,
  description: false,
  tags: false,
  rating: false,
};

const reviewFieldLabels = {
  title: 'Título *',
  description: 'Descripción de tu Reseña *',
  tags: 'Etiquetas *',
};

const normalFieldLabels = {
  title: 'Título *',
  description: 'Descripción de tu Publicación *',
  tags: 'Etiquetas *',
};

const REVIEW_SCORE_MAX = 5;

const scoreMatch = (title: string, query: string) => {
  const normalizedTitle = title.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (normalizedTitle === normalizedQuery) {
    return 3;
  }

  if (normalizedTitle.startsWith(normalizedQuery)) {
    return 2;
  }

  if (normalizedTitle.includes(normalizedQuery)) {
    return 1;
  }

  return 0;
};

export default function CreatePostScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const frameScrollRef = useRef<ScrollView>(null);
  const [isReview, setIsReview] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [reviewQuery, setReviewQuery] = useState('');
  const [selectedGameTitle, setSelectedGameTitle] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [reviewScore, setReviewScore] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [errors, setErrors] = useState<FieldError>(emptyErrors);
  const [layoutMap, setLayoutMap] = useState<Record<FieldKey, number>>({
    title: 0,
    description: 0,
    tags: 0,
    rating: 0,
  });

  const addPost = usePostStore((state) => state.addPost);
  const showToast = useToastStore((state) => state.showToast);

  const activeLabels = isReview ? reviewFieldLabels : normalFieldLabels;

  const resetForm = useCallback(() => {
    setIsReview(false);
    setPostTitle('');
    setReviewQuery('');
    setSelectedGameTitle(null);
    setDescription('');
    setTagsText('');
    setReviewScore(0);
    setSelectedImages([]);
    setActiveImageIndex(0);
    setFrameWidth(0);
    setErrors(emptyErrors);
    setLayoutMap({
      title: 0,
      description: 0,
      tags: 0,
      rating: 0,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return undefined;
    }, [resetForm]),
  );

  const matchingGames = useMemo(() => {
    const query = reviewQuery.trim();

    if (!query) {
      return [];
    }

    return mockGameProfiles
      .map((game) => ({
        game,
        score: scoreMatch(game.title, query),
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return left.game.title.localeCompare(right.game.title);
      })
      .map((item) => item.game)
      .slice(0, 5);
  }, [reviewQuery]);

  const tags = useMemo(
    () =>
      tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsText],
  );

  const resolvedTitle = isReview
    ? selectedGameTitle ?? matchingGames[0]?.title ?? reviewQuery.trim()
    : postTitle.trim();

  const scrollToField = (field: FieldKey) => {
    const y = layoutMap[field] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(y - 16, 0), animated: true });
  };

  const handleFieldLayout = (field: FieldKey, layoutY: number) => {
    setLayoutMap((current) => ({
      ...current,
      [field]: layoutY,
    }));
  };

  const requestImagePermission = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      showToast('Necesitamos permiso para subir imágenes.', 'error');
      return false;
    }

    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestImagePermission();

    if (!hasPermission) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const nextImages = result.assets
        .map((asset) => asset.uri)
        .filter((uri): uri is string => Boolean(uri));

      setSelectedImages((currentImages) => {
        const mergedImages = [...currentImages, ...nextImages];
        setActiveImageIndex(currentImages.length);
        return mergedImages;
      });
    } catch {
      showToast('No se pudieron cargar las imágenes.', 'error');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages((currentImages) => {
      const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
      const nextActiveIndex = updatedImages.length === 0 ? 0 : Math.min(activeImageIndex, updatedImages.length - 1);

      setActiveImageIndex(nextActiveIndex);

      if (updatedImages.length > 0 && frameWidth > 0) {
        frameScrollRef.current?.scrollTo({ x: nextActiveIndex * frameWidth, animated: false });
      }

      return updatedImages;
    });
  };

  const handleScrollToImage = (index: number) => {
    if (!frameWidth || index < 0 || index >= selectedImages.length) {
      return;
    }

    setActiveImageIndex(index);
    frameScrollRef.current?.scrollTo({ x: index * frameWidth, animated: true });
  };

  const handleSubmit = async () => {
    const nextErrors: FieldError = {
      title: !resolvedTitle,
      description: !description.trim(),
      tags: tags.length === 0,
      rating: isReview && reviewScore === 0,
    };

    setErrors(nextErrors);

    const firstInvalidField = (Object.entries(nextErrors) as Array<[FieldKey, boolean]>).find(
      ([, hasError]) => hasError,
    )?.[0];

    if (firstInvalidField) {
      scrollToField(firstInvalidField);
      showToast('Completa los campos obligatorios para continuar.', 'error');
      return;
    }

    if (isReview && !selectedGameTitle && !matchingGames.length) {
      setErrors((currentErrors) => ({ ...currentErrors, title: true }));
      scrollToField('title');
      showToast('No hay coincidencias para el juego que buscas.', 'error');
      return;
    }

    const now = new Date().toISOString();
    const finalGameTitle = isReview ? selectedGameTitle ?? matchingGames[0]?.title ?? resolvedTitle : resolvedTitle;

    const newPost: Post = {
      id: `${Date.now()}`,
      autor: mockUser.id,
      author_display_name: mockUser.display_name,
      author_username: mockUser.username,
      author_profile_pic: mockUser.profile_pic,
      post_title: finalGameTitle,
      content: description.trim(),
      media: {
        images: [...selectedImages],
        hashtags: [...tags],
      },
      is_review: isReview,
      review_score: isReview ? reviewScore : null,
      reviewed_game: finalGameTitle,
      likes_counter: 0,
      commets_counter: 0,
      created_at: now,
      last_modified_at: now,
      deleted_at: null,
    };

    try {
      addPost(newPost);
      showToast('Se ha creado el post correctamente', 'success');
      resetForm();
      router.replace('/(tabs)');
    } catch {
      showToast('No se pudo crear el post.', 'error');
    }
  };

  return (
    <ImageBackground source={require('../../../assets/images/bgbody.png')} style={styles.background}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#111111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isReview ? 'Crear Reseña' : 'Crear Post'}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formCard}>
              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.sectionLabel}>Tipo de publicación</Text>
                  <Text style={styles.sectionHint}>Activa la opción de reseña si vas a calificar un juego.</Text>
                </View>
                <View style={styles.segmentControl}>
                  <TouchableOpacity
                    onPress={() => setIsReview(false)}
                    style={[styles.segmentButton, !isReview && styles.segmentButtonActive]}
                  >
                    <Text style={[styles.segmentText, !isReview && styles.segmentTextActive]}>Post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsReview(true)}
                    style={[styles.segmentButton, isReview && styles.segmentButtonActive]}
                  >
                    <Text style={[styles.segmentText, isReview && styles.segmentTextActive]}>Reseña</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={styles.fieldGroup}
                onLayout={(event) => {
                  const layoutY = event.nativeEvent.layout.y;
                  handleFieldLayout('title', layoutY);
                }}
              >
                <Text style={styles.fieldLabel}>{activeLabels.title}</Text>
                <View style={[styles.inputShell, errors.title && styles.inputShellError]}>
                  <Ionicons name={isReview ? 'search' : 'create-outline'} size={18} color="#6E6E6E" />
                  <TextInput
                    value={isReview ? reviewQuery : postTitle}
                    onChangeText={(text) => {
                      if (isReview) {
                        setReviewQuery(text);
                        setSelectedGameTitle(null);
                      } else {
                        setPostTitle(text);
                      }
                      setErrors((currentErrors) => ({ ...currentErrors, title: false }));
                    }}
                    placeholder={isReview ? 'Busca el título de un videojuego' : 'Ej. DEAD SPACE'}
                    placeholderTextColor="#7D746A"
                    style={styles.input}
                  />
                </View>

                {isReview && reviewQuery.trim().length > 0 ? (
                  <View style={styles.suggestionsBox}>
                    {matchingGames.length > 0 ? (
                      matchingGames.map((game) => {
                        const isSelected = selectedGameTitle === game.title;

                        return (
                          <TouchableOpacity
                            key={game.id}
                            onPress={() => {
                              setReviewQuery(game.title);
                              setSelectedGameTitle(game.title);
                              setErrors((currentErrors) => ({ ...currentErrors, title: false }));
                            }}
                            style={[styles.suggestionItem, isSelected && styles.suggestionItemSelected]}
                          >
                            <Ionicons name="game-controller-outline" size={18} color="#0B4B82" />
                            <Text style={styles.suggestionText}>{game.title}</Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text style={styles.noMatchesText}>no hay coincidencias</Text>
                    )}
                  </View>
                ) : null}
              </View>

              {isReview ? (
                <View
                  style={styles.fieldGroup}
                  onLayout={(event) => {
                    const layoutY = event.nativeEvent.layout.y;
                    handleFieldLayout('rating', layoutY);
                  }}
                >
                  <Text style={styles.fieldLabel}>Calificación *</Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: REVIEW_SCORE_MAX }).map((_, index) => {
                      const score = index + 1;

                      return (
                        <TouchableOpacity key={score} onPress={() => setReviewScore(score)} style={styles.starButton}>
                          <Ionicons
                            name={score <= reviewScore ? 'star' : 'star-outline'}
                            size={30}
                            color={score <= reviewScore ? '#C48200' : '#8C7358'}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {errors.rating ? <Text style={styles.errorText}>Selecciona una calificación.</Text> : null}
                </View>
              ) : null}

              <View
                style={styles.fieldGroup}
                onLayout={(event) => {
                  const layoutY = event.nativeEvent.layout.y;
                  handleFieldLayout('description', layoutY);
                }}
              >
                <Text style={styles.fieldLabel}>{activeLabels.description}</Text>
                <View style={[styles.textAreaShell, errors.description && styles.inputShellError]}>
                  <TextInput
                    value={description}
                    onChangeText={(text) => {
                      setDescription(text);
                      setErrors((currentErrors) => ({ ...currentErrors, description: false }));
                    }}
                    placeholder="Comparte tu experiencia con la comunidad."
                    placeholderTextColor="#7D746A"
                    style={styles.textArea}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View
                style={styles.fieldGroup}
                onLayout={(event) => {
                  const layoutY = event.nativeEvent.layout.y;
                  handleFieldLayout('tags', layoutY);
                }}
              >
                <Text style={styles.fieldLabel}>{activeLabels.tags}</Text>
                <View style={[styles.inputShell, errors.tags && styles.inputShellError]}>
                  <Ionicons name="pricetag-outline" size={18} color="#6E6E6E" />
                  <TextInput
                    value={tagsText}
                    onChangeText={(text) => {
                      setTagsText(text);
                      setErrors((currentErrors) => ({ ...currentErrors, tags: false }));
                    }}
                    placeholder="Ej. RPG, FPS, OpenWorld"
                    placeholderTextColor="#7D746A"
                    style={styles.input}
                  />
                </View>

                {tags.length > 0 ? (
                  <View style={styles.tagPreviewRow}>
                    {tags.map((tag) => (
                      <View key={tag} style={styles.tagPreview}>
                        <Text style={styles.tagPreviewText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {errors.tags ? <Text style={styles.errorText}>Agrega al menos una etiqueta separada por coma.</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Imagen del post</Text>
                {selectedImages.length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const layoutWidth = event.nativeEvent.layout.width;
                      setFrameWidth(layoutWidth);
                    }}
                    style={styles.imageFrame}
                  >
                    <TouchableOpacity onPress={pickImages} style={styles.uploadAnotherButton}>
                      <Text style={styles.uploadAnotherText}>subir otra imagen</Text>
                    </TouchableOpacity>

                    <ScrollView
                      ref={frameScrollRef}
                      horizontal
                      pagingEnabled
                      nestedScrollEnabled
                      showsHorizontalScrollIndicator={false}
                      onMomentumScrollEnd={(event) => {
                        if (!frameWidth) {
                          return;
                        }

                        const nextIndex = Math.round(event.nativeEvent.contentOffset.x / frameWidth);
                        setActiveImageIndex(nextIndex);
                      }}
                      style={styles.imageScroll}
                    >
                      {selectedImages.map((image, index) => (
                        <View key={`${image}-${index}`} style={[styles.imageSlide, frameWidth ? { width: frameWidth } : null]}>
                          <Image source={{ uri: image }} style={styles.imagePreview} />
                          <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeImageButton}>
                            <Ionicons name="close" size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>

                    {selectedImages.length > 1 ? (
                      <>
                        <TouchableOpacity
                          onPress={() => handleScrollToImage(activeImageIndex - 1)}
                          disabled={activeImageIndex === 0}
                          style={[styles.arrowButton, styles.leftArrow, activeImageIndex === 0 && styles.arrowDisabled]}
                        >
                          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleScrollToImage(activeImageIndex + 1)}
                          disabled={activeImageIndex === selectedImages.length - 1}
                          style={[
                            styles.arrowButton,
                            styles.rightArrow,
                            activeImageIndex === selectedImages.length - 1 && styles.arrowDisabled,
                          ]}
                        >
                          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View style={styles.imageCounter}>
                          <Text style={styles.imageCounterText}>{`${activeImageIndex + 1}/${selectedImages.length}`}</Text>
                        </View>
                      </>
                    ) : null}
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={pickImages}
                    onLayout={(event) => {
                      const layoutWidth = event.nativeEvent.layout.width;
                      setFrameWidth(layoutWidth);
                    }}
                    style={styles.imageFrame}
                  >
                    <View style={styles.emptyImageState}>
                      <Ionicons name="camera" size={46} color="#0B4B82" />
                      <Text style={styles.emptyImageText}>Toca para subir una imagen</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Publicar post</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 10,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 23,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  formCard: {
    marginHorizontal: 0,
    marginTop: 2,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: 'rgba(228, 210, 188, 0.95)',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  sectionHint: {
    marginTop: 4,
    maxWidth: 210,
    fontSize: 12,
    lineHeight: 16,
    color: '#5B5147',
  },
  segmentControl: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: 180,
    alignSelf: 'flex-start',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.08)',
  },
  segmentButton: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#0B4B82',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B5147',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
  },
  inputShell: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputShellError: {
    borderColor: '#B42318',
    backgroundColor: 'rgba(255,239,239,0.96)',
  },
  input: {
    flex: 1,
    color: '#111111',
    fontSize: 15,
    fontWeight: '500',
  },
  suggestionsBox: {
    marginTop: 10,
    borderRadius: 16,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(11,75,130,0.18)',
    gap: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(11,75,130,0.08)',
  },
  suggestionItemSelected: {
    backgroundColor: 'rgba(11,75,130,0.18)',
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0E304E',
  },
  noMatchesText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    color: '#7C5A4D',
    paddingVertical: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starButton: {
    paddingVertical: 2,
  },
  textAreaShell: {
    minHeight: 136,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    flex: 1,
    minHeight: 110,
    color: '#111111',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#B42318',
  },
  tagPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tagPreview: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(11,75,130,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(11,75,130,0.16)',
  },
  tagPreviewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B4B82',
  },
  imageFrame: {
    height: 235,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.08)',
  },
  emptyImageState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyImageText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B4B82',
  },
  imageScroll: {
    flex: 1,
  },
  imageSlide: {
    height: 235,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadAnotherButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(17,17,17,0.56)',
  },
  uploadAnotherText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,75,130,0.75)',
    zIndex: 4,
  },
  leftArrow: {
    left: 12,
  },
  rightArrow: {
    right: 12,
  },
  arrowDisabled: {
    opacity: 0.35,
  },
  imageCounter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(17,17,17,0.52)',
    zIndex: 4,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,17,17,0.62)',
    zIndex: 5,
  },
  submitButton: {
    marginTop: 8,
    alignSelf: 'center',
    minWidth: 230,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#0B4B82',
    shadowColor: '#0B4B82',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
});