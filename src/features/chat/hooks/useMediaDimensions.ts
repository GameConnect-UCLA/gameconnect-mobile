/** Hook for calculating image dimensions from an attachment */
import { useState, useEffect } from "react";
import { Image } from "react-native";
import type { Attachment } from '../types/chat.types';
import { AttachmentType } from '../types/chat.types';
import { FALLBACK_ASPECT_RATIO } from '../components/common/constants';

/** Compute display dimensions for a media attachment @param attachment - The attachment object @param maxWidth - Maximum display width @returns { width, height } */
export function useMediaDimensions(
  attachment: Attachment,
  maxWidth: number,
): { width: number; height: number } {
  const [aspectRatio, setAspectRatio] = useState<number>(
    attachment.width && attachment.height
      ? attachment.width / attachment.height
      : FALLBACK_ASPECT_RATIO,
  );

  useEffect(() => {
    if (attachment.width && attachment.height) return;
    if (
      attachment.type !== AttachmentType.IMAGE &&
      attachment.type !== AttachmentType.GIF
    )
      return;

    Image.getSize(
      attachment.url,
      (w, h) => {
        if (w > 0 && h > 0) setAspectRatio(w / h);
      },
      () => {},
    );
  }, [attachment]);

  return { width: maxWidth, height: maxWidth / aspectRatio };
}
