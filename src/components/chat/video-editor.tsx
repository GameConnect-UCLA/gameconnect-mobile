import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  useSharedValue,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");
const TOP_BAR_H = 56;
const TRIM_BAR_MARGIN = 28;
const TRIM_BAR_H = 44;
const THUMB_SIZE = 16;
const MIN_TRIM_DURATION = 1;

interface VideoEditorProps {
  visible: boolean;
  videoUri: string;
  fileName?: string;
  onCancel: () => void;
  onConfirm: (result: {
    uri: string;
    trimStart: number;
    trimEnd: number;
    muted: boolean;
    fileName: string;
    duration: number;
  }) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoEditor({
  visible,
  videoUri,
  fileName,
  onCancel,
  onConfirm,
}: VideoEditorProps) {
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const durationRef = useRef(0);

  const player = useVideoPlayer(videoUri, (p) => {
    p.timeUpdateEventInterval = 0.05;
    p.loop = false;
    p.muted = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const timeUpdate = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentLiveTimestamp: null as number | null,
    currentOffsetFromLive: null as number | null,
    bufferedPosition: 0,
  });
  const playbackTime = timeUpdate.currentTime;

  useEffect(() => {
    const d = player.duration;
    if (d > 0 && duration === 0) {
      setDuration(d);
      durationRef.current = d;
      trimStart.value = 0;
      trimEnd.value = d;
    }
  }, [player.duration, duration]);

  const trimStart = useSharedValue(0);
  const trimEnd = useSharedValue(0);

  const trimBarWidth = SCREEN_W - TRIM_BAR_MARGIN * 2 - THUMB_SIZE;

  const startPos = useDerivedValue(
    () => (trimStart.value / Math.max(durationRef.current, 0.1)) * trimBarWidth
  );
  const endPos = useDerivedValue(
    () => (trimEnd.value / Math.max(durationRef.current, 0.1)) * trimBarWidth
  );

  const playheadPos = useDerivedValue(
    () =>
      (playbackTime / Math.max(durationRef.current, 0.1)) * trimBarWidth
  );

  const selectedBarStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: startPos.value,
    width: Math.max(0, endPos.value - startPos.value),
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  }));

  const playheadStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: playheadPos.value,
    width: 2,
    height: TRIM_BAR_H,
    backgroundColor: "#fff",
  }));

  const startThumbStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: startPos.value,
    top: (TRIM_BAR_H - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
  }));

  const endThumbStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: endPos.value,
    top: (TRIM_BAR_H - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
  }));

  const clampTrim = useCallback((val: number) => {
    "worklet";
    return Math.max(0, Math.min(val, durationRef.current));
  }, []);

  const startGesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          const deltaSec =
            (e.changeX / trimBarWidth) * durationRef.current;
          trimStart.value = clampTrim(trimStart.value + deltaSec);
        })
        .onEnd(() => {
          if (trimEnd.value - trimStart.value < MIN_TRIM_DURATION) {
            trimStart.value = trimEnd.value - MIN_TRIM_DURATION;
          }
          runOnJS(setPlayerTime)(trimStart.value);
        }),
    [trimBarWidth, clampTrim]
  );

  const endGesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          const deltaSec =
            (e.changeX / trimBarWidth) * durationRef.current;
          trimEnd.value = clampTrim(trimEnd.value + deltaSec);
        })
        .onEnd(() => {
          if (trimEnd.value - trimStart.value < MIN_TRIM_DURATION) {
            trimEnd.value = trimStart.value + MIN_TRIM_DURATION;
          }
          runOnJS(setPlayerTime)(trimEnd.value);
        }),
    [trimBarWidth, clampTrim]
  );

  const setPlayerTime = useCallback(
    (time: number) => {
      player.currentTime = time;
    },
    [player]
  );

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      if (
        playbackTime < trimStart.value ||
        playbackTime >= trimEnd.value
      ) {
        player.currentTime = trimStart.value;
      }
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, playbackTime, player]);

  useEffect(() => {
    if (
      isPlaying &&
      durationRef.current > 0 &&
      playbackTime >= trimEnd.value
    ) {
      player.pause();
      player.currentTime = trimStart.value;
    }
  }, [playbackTime, isPlaying, player]);

  const toggleSound = useCallback(() => {
    player.muted = !player.muted;
    setMuted(!muted);
  }, [muted, player]);

  const handleConfirm = useCallback(() => {
    player.pause();
    onConfirm({
      uri: videoUri,
      trimStart: Math.round(trimStart.value * 10) / 10,
      trimEnd: Math.round(trimEnd.value * 10) / 10,
      muted,
      fileName: fileName || "video_" + Date.now() + ".mp4",
      duration,
    });
  }, [videoUri, trimStart, trimEnd, muted, fileName, duration, onConfirm, player]);

  const handleCancel = useCallback(() => {
    player.pause();
    onCancel();
  }, [player, onCancel]);

  const trimmedDuration = Math.max(0, trimEnd.value - trimStart.value);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.previewContainer}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls={false}
          />
          <TouchableOpacity
            style={styles.playOverlay}
            onPress={togglePlay}
            activeOpacity={0.7}
          >
            <View style={styles.playButton}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={40}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.trimSection}>
          <View style={styles.trimBarContainer}>
            <View style={styles.trackBg}>
              <Animated.View style={selectedBarStyle} />
              <Animated.View style={playheadStyle} />
              <View style={styles.trackLine} />
            </View>
            <GestureDetector gesture={startGesture}>
              <Animated.View style={startThumbStyle} />
            </GestureDetector>
            <GestureDetector gesture={endGesture}>
              <Animated.View style={endThumbStyle} />
            </GestureDetector>
          </View>

          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>{formatTime(trimStart.value)}</Text>
            <Text style={styles.timeLabel}>{formatTime(trimEnd.value)}</Text>
          </View>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.soundButton} onPress={toggleSound}>
            <Ionicons
              name={muted ? "volume-mute" : "volume-high"}
              size={26}
              color="#fff"
            />
            <Text style={styles.soundLabel}>
              {muted ? "No sound" : "Sound on"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.trimmedDuration}>
            Duration: {formatTime(trimmedDuration)}
          </Text>
        </View>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleCancel} style={styles.topBarButton}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Edit Video</Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.doneButton}
          >
            <Ionicons name="checkmark" size={26} color="#033563" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 40,
  },
  previewContainer: {
    width: SCREEN_W,
    height: SCREEN_W * 0.6,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  trimSection: {
    paddingHorizontal: TRIM_BAR_MARGIN,
    marginTop: 24,
  },
  trimBarContainer: {
    height: TRIM_BAR_H,
    justifyContent: "center",
  },
  trackBg: {
    position: "relative",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "visible",
  },
  trackLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "transparent",
    borderRadius: 2,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    marginTop: 24,
  },
  soundButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  soundLabel: {
    color: "#fff",
    fontSize: 15,
  },
  trimmedDuration: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: TOP_BAR_H,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  topBarButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  doneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
