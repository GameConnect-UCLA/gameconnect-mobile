import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
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

interface ChatMessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onLongPress?: (message: Message) => void;
}

export default function ChatMessageBubble({
  message,
  isOwnMessage,
  onLongPress,
}: ChatMessageBubbleProps) {
  const { width: screenWidth } = useWindowDimensions();
  const maxBubbleWidth = screenWidth * BUBBLE_MAX_WIDTH_RATIO;
  const maxMediaWidth = maxBubbleWidth - 16;

  const [fullScreenAttachment, setFullScreenAttachment] =
    useState<Attachment | null>(null);

  const openFullScreen = useCallback((a: Attachment) => {
    setFullScreenAttachment(a);
  }, []);

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

  const mediaOnly =
    attachments.length > 0 && !hasText && !hasReply;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.95}
        onLongPress={() => onLongPress?.(message)}
        delayLongPress={350}
        style={[
          styles.wrapper,
          isOwnMessage ? styles.wrapperRight : styles.wrapperLeft,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isOwnMessage ? styles.bubbleOwn : styles.bubbleOther,
            mediaOnly && styles.bubbleMediaOnly,
            { maxWidth: maxBubbleWidth },
          ]}
        >
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

          {hasText && (
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.textOwn : styles.textOther,
                attachments.length > 0 && styles.textWithMedia,
              ]}
            >
              {message.message_text}
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
        </View>
      </TouchableOpacity>

      <FullScreenViewer
        attachment={fullScreenAttachment}
        visible={fullScreenAttachment !== null}
        onClose={() => setFullScreenAttachment(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  wrapperRight: {
    alignItems: "flex-end",
  },
  wrapperLeft: {
    alignItems: "flex-start",
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
});
