import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import type { Attachment, Message } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";
import { BUBBLE_MAX_WIDTH_RATIO } from "./constants";
import { formatMessageTime } from "./helpers";
import ReplyPreview from "./reply-preview";
import ImageAttachment from "./image-attachment";
import VideoAttachment from "./video-attachment";
import AudioAttachment from "./audio-attachment";
import DocumentAttachment from "./document-attachment";
import FullScreenViewer from "./full-screen-viewer";
import GameInfoCardComponent from "../game-info-card";

const SWIPE_THRESHOLD = 80;
const GROUP_AVATAR_SIZE = 28;
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

interface ChatMessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onLongPress?: (message: Message, pageY: number) => void;
  onSwipeToReply?: (message: Message) => void;
  highlightText?: string | null;
  isGroup?: boolean;
  senderName?: string | null;
  senderAvatar?: string | null;
  onMentionPress?: (username: string) => void;
  onGameCardPress?: (gameId: string) => void;
}

const URL_REGEX = /(https?:\/\/[^\s<]+|[\w.-]+\.[a-zA-Z]{2,6}(?:\/[\w\-./?%&=~#+]*)?)/g;

function normalizeUrl(url: string): string {
  const cleaned = url.replace(/[.,!?;:()]+$/, "");
  return cleaned.startsWith("http://") || cleaned.startsWith("https://")
    ? cleaned
    : `https://${cleaned}`;
}
const MENTION_REGEX = /@(\w+)/g;

type TextSegment = {
  text: string;
  highlighted: boolean;
  isLink?: boolean;
  isMention?: boolean;
};

export default function ChatMessageBubble({
  message,
  isOwnMessage,
  onLongPress,
  onSwipeToReply,
  highlightText,
  isGroup,
  senderName,
  senderAvatar,
  onMentionPress,
  onGameCardPress,
}: ChatMessageBubbleProps) {
  const { width: screenWidth } = useWindowDimensions();
  const maxBubbleWidth = screenWidth * BUBBLE_MAX_WIDTH_RATIO;
  const maxMediaWidth = maxBubbleWidth - 16;

  const [fullScreenAttachment, setFullScreenAttachment] =
    useState<Attachment | null>(null);

  const openFullScreen = useCallback((a: Attachment) => {
    setFullScreenAttachment(a);
  }, []);

  const translateX = useSharedValue(0);

  const handleSwipeEnd = useCallback(() => {
    onSwipeToReply?.(message);
  }, [onSwipeToReply, message]);

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .activeOffsetX(10)
    .failOffsetY([-10, 10] as const)
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX >= SWIPE_THRESHOLD) {
        runOnJS(handleSwipeEnd)();
      }
      translateX.value = withSpring(0, { stiffness: 200, damping: 20 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textSegments = useMemo((): TextSegment[] | null => {
    if (!message.message_text) return null;

    const escaped = highlightText
      ? highlightText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      : null;
    const searchRegex = escaped ? new RegExp(`(${escaped})`, "gi") : null;

    // Split text by URL boundaries first
    const urlParts: { text: string; isLink: boolean }[] = [];
    let lastUrlIndex = 0;
    let urlMatch: RegExpExecArray | null;
    const urlRegex = new RegExp(URL_REGEX.source, "g");
    while ((urlMatch = urlRegex.exec(message.message_text)) !== null) {
      if (urlMatch.index > lastUrlIndex) {
        urlParts.push({
          text: message.message_text.slice(lastUrlIndex, urlMatch.index),
          isLink: false,
        });
      }
      urlParts.push({ text: urlMatch[0], isLink: true });
      lastUrlIndex = urlRegex.lastIndex;
    }
    if (lastUrlIndex < message.message_text.length) {
      urlParts.push({
        text: message.message_text.slice(lastUrlIndex),
        isLink: false,
      });
    }

    // Split each non-link part by @mention
    const segments: TextSegment[] = [];
    for (const part of urlParts) {
      if (part.isLink) {
        segments.push({
          text: part.text,
          highlighted: false,
          isLink: true,
        });
      } else {
        let lastMentionIndex = 0;
        let mentionMatch: RegExpExecArray | null;
        const mentionRegex = new RegExp(MENTION_REGEX.source, "g");
        while ((mentionMatch = mentionRegex.exec(part.text)) !== null) {
          if (mentionMatch.index > lastMentionIndex) {
            const plainText = part.text.slice(lastMentionIndex, mentionMatch.index);
            // Check if plain text has search highlight
            if (searchRegex) {
              let lastSearchIndex = 0;
              let searchMatch: RegExpExecArray | null;
              while ((searchMatch = searchRegex.exec(plainText)) !== null) {
                if (searchMatch.index > lastSearchIndex) {
                  segments.push({
                    text: plainText.slice(lastSearchIndex, searchMatch.index),
                    highlighted: false,
                  });
                }
                segments.push({ text: searchMatch[0], highlighted: true });
                lastSearchIndex = searchRegex.lastIndex;
              }
              if (lastSearchIndex < plainText.length) {
                segments.push({
                  text: plainText.slice(lastSearchIndex),
                  highlighted: false,
                });
              }
            } else {
              segments.push({ text: plainText, highlighted: false });
            }
          }
          segments.push({
            text: mentionMatch[0],
            highlighted: false,
            isMention: true,
          });
          lastMentionIndex = mentionRegex.lastIndex;
        }
        if (lastMentionIndex < part.text.length) {
          const remaining = part.text.slice(lastMentionIndex);
          if (searchRegex) {
            let lastSearchIndex = 0;
            let searchMatch: RegExpExecArray | null;
            while ((searchMatch = searchRegex.exec(remaining)) !== null) {
              if (searchMatch.index > lastSearchIndex) {
                segments.push({
                  text: remaining.slice(lastSearchIndex, searchMatch.index),
                  highlighted: false,
                });
              }
              segments.push({ text: searchMatch[0], highlighted: true });
              lastSearchIndex = searchRegex.lastIndex;
            }
            if (lastSearchIndex < remaining.length) {
              segments.push({
                text: remaining.slice(lastSearchIndex),
                highlighted: false,
              });
            }
          } else {
            segments.push({ text: remaining, highlighted: false });
          }
        }
      }
    }

    return segments;
  }, [message.message_text, highlightText]);

  const isGroupOther = isGroup && !isOwnMessage;

  const attachments = message.attached_media ?? [];
  const hasText = !!message.message_text?.length;
  const hasReply = !!message.reply_to_message;

  const imageAttachments = attachments.filter(
    (a) => a.type === AttachmentType.IMAGE || a.type === AttachmentType.GIF,
  );
  const videoAttachments = attachments.filter(
    (a) => a.type === AttachmentType.VIDEO,
  );
  const audioAttachments = attachments.filter(
    (a) => a.type === AttachmentType.AUDIO,
  );
  const documentAttachments = attachments.filter(
    (a) => a.type === AttachmentType.DOCUMENT,
  );

  const mediaOnly = attachments.length > 0 && !hasText && !hasReply;

  const avatarUri = isGroupOther
    ? senderAvatar ?? message.sender_profile_pic ?? null
    : null;

  const bubbleContent = (
    <>
      {hasReply && (
        <ReplyPreview
          message={message.reply_to_message!}
          isOwnMessage={isOwnMessage}
        />
      )}

      {imageAttachments.map((a, i) => (
        <View
          key={`img-${i}`}
          style={
            hasText || hasReply || i > 0 ? styles.mediaAboveText : undefined
          }
        >
          <ImageAttachment
            attachment={a}
            maxWidth={maxMediaWidth}
            onPress={() => openFullScreen(a)}
          />
        </View>
      ))}

      {videoAttachments.map((a, i) => (
        <View
          key={`vid-${i}`}
          style={[
            i > 0 || imageAttachments.length > 0 ? { marginTop: 4 } : undefined,
            hasText || hasReply ? styles.mediaAboveText : undefined,
          ]}
        >
          <VideoAttachment attachment={a} maxWidth={maxMediaWidth} />
        </View>
      ))}

      {audioAttachments.map((a, i) => (
        <AudioAttachment
          key={`aud-${i}`}
          attachment={a}
          isOwnMessage={isOwnMessage}
        />
      ))}

      {documentAttachments.map((a, i) => (
        <DocumentAttachment
          key={`doc-${i}`}
          attachment={a}
          isOwnMessage={isOwnMessage}
        />
      ))}

      {message.game_card && (
        <GameInfoCardComponent
          game={message.game_card}
          maxWidth={maxBubbleWidth - 24}
          onPress={() => onGameCardPress?.(message.game_card!.game_id)}
        />
      )}

      {hasText && (
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.textOwn : styles.textOther,
            attachments.length > 0 && styles.textWithMedia,
          ]}
        >
          {textSegments
            ? textSegments.map((part, i) => {
                if (part.isLink) {
                  return (
                    <Text
                      key={i}
                      style={[
                        styles.linkText,
                        isOwnMessage
                          ? styles.linkTextOwn
                          : styles.linkTextOther,
                      ]}
                      onPress={() => Linking.openURL(normalizeUrl(part.text))}
                    >
                      {part.text}
                    </Text>
                  );
                }
                if (part.isMention) {
                  return (
                    <Text
                      key={i}
                      style={[
                        styles.mentionText,
                        isOwnMessage
                          ? styles.mentionTextOwn
                          : styles.mentionTextOther,
                      ]}
                      onPress={() =>
                        onMentionPress?.(part.text.slice(1))
                      }
                    >
                      {part.text}
                    </Text>
                  );
                }
                if (part.highlighted) {
                  return (
                    <Text
                      key={i}
                      style={[
                        styles.highlight,
                        isOwnMessage
                          ? styles.highlightOwn
                          : styles.highlightOther,
                      ]}
                    >
                      {part.text}
                    </Text>
                  );
                }
                return <Text key={i}>{part.text}</Text>;
              })
            : message.message_text}
        </Text>
      )}

      <Text
        style={[
          styles.timestamp,
          isOwnMessage ? styles.timestampOwn : styles.timestampOther,
        ]}
      >
        {formatMessageTime(message.sent_at)}
      </Text>
    </>
  );

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.wrapperContainer, animatedStyle]}>
          <TouchableOpacity
            activeOpacity={0.95}
            onLongPress={(e) => onLongPress?.(message, e.nativeEvent.pageY)}
            delayLongPress={350}
            style={[
              styles.wrapper,
              isOwnMessage ? styles.wrapperRight : styles.wrapperLeft,
              isGroupOther && styles.wrapperGroupOther,
            ]}
          >
            {isGroupOther && (
              <View style={styles.avatarColumn}>
                <Image
                  source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
                  style={styles.groupAvatar}
                />
              </View>
            )}
            <View style={isGroupOther ? styles.bubbleColumn : undefined}>
              {isGroupOther && senderName && (
                <Text style={styles.senderName}>{senderName}</Text>
              )}
              <View
                style={[
                  styles.bubble,
                  isOwnMessage ? styles.bubbleOwn : styles.bubbleOther,
                  mediaOnly && styles.bubbleMediaOnly,
                  { maxWidth: isGroupOther ? maxBubbleWidth - GROUP_AVATAR_SIZE - 8 : maxBubbleWidth },
                ]}
              >
                {bubbleContent}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      <FullScreenViewer
        attachment={fullScreenAttachment}
        visible={fullScreenAttachment !== null}
        onClose={() => setFullScreenAttachment(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapperContainer: {
    marginBottom: 6,
  },
  wrapper: {
    paddingHorizontal: 12,
    flexDirection: "row",
  },
  wrapperRight: {
    justifyContent: "flex-end",
  },
  wrapperLeft: {
    justifyContent: "flex-start",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 4,
  },
  bubbleOwn: {
    backgroundColor: "#033563",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderBottomLeftRadius: 4,
  },
  bubbleMediaOnly: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    paddingBottom: 4,
  },
  mediaAboveText: {
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 2,
  },
  textOwn: {
    color: "#fff",
  },
  textOther: {
    color: "#1a1a1a",
  },
  textWithMedia: {
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 3,
    marginBottom: 2,
  },
  timestampOwn: {
    color: "rgba(255,255,255,0.55)",
    textAlign: "right",
  },
  timestampOther: {
    color: "#aaa",
    textAlign: "right",
  },
  wrapperGroupOther: {
    alignItems: "flex-start",
  },
  avatarColumn: {
    width: GROUP_AVATAR_SIZE,
    marginRight: 8,
    marginTop: 4,
  },
  groupAvatar: {
    width: GROUP_AVATAR_SIZE,
    height: GROUP_AVATAR_SIZE,
    borderRadius: GROUP_AVATAR_SIZE / 2,
    backgroundColor: "#ccc",
  },
  bubbleColumn: {
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginBottom: 2,
    marginLeft: 2,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  linkTextOwn: {
    color: "#4DA6FF",
  },
  linkTextOther: {
    color: "#4DA6FF",
  },
  mentionText: {
    fontWeight: "600",
  },
  mentionTextOwn: {
    color: "#FFD700",
  },
  mentionTextOther: {
    color: "#033563",
  },
  highlight: {
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
  highlightOwn: {
    backgroundColor: "#FFD700",
  },
  highlightOther: {
    backgroundColor: "#FFD700",
  },
});
