import { ImageSourcePropType } from "react-native";

export type ActiveUser = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
};

export type Conversation = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  lastMessage: string;
  time: string;
  memberCount?: number;
  sender?: string;
  isGroup?: boolean;
};