import { useState, useEffect } from "react";
import { Image } from "react-native";
import type { Attachment } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";
import { FALLBACK_ASPECT_RATIO } from "./constants";

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
