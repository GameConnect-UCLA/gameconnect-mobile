import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Text,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  Canvas,
  Image as SkiaImage,
  useImage,
  useCanvasRef,
  Skia,
  Path,
  Rect,
  RoundedRect,
  FillType,
} from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  useSharedValue,
  runOnJS,
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const TOP_BAR_H = 56;
const BOTTOM_BAR_H = 80;
const HANDLE_SIZE = 24;
const MIN_CROP_SIZE = 60;

const COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FFFFFF",
  "#000000",
];
const STROKE_WIDTHS = [2, 4, 6, 8, 12];

interface DrawingPoint {
  x: number;
  y: number;
}

interface CompletedStroke {
  points: DrawingPoint[];
  color: string;
  strokeWidth: number;
}

interface ImageEditorProps {
  visible: boolean;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  fileName?: string;
  onCancel: () => void;
  onConfirm: (result: {
    uri: string;
    width: number;
    height: number;
    fileName: string;
  }) => void;
}

function fitImage(
  imgW: number,
  imgH: number,
  availableW: number,
  availableH: number
) {
  const aspect = imgW / imgH;
  let displayW: number;
  let displayH: number;
  if (aspect > availableW / availableH) {
    displayW = availableW;
    displayH = availableW / aspect;
  } else {
    displayH = availableH;
    displayW = availableH * aspect;
  }
  return {
    width: displayW,
    height: displayH,
    x: (availableW - displayW) / 2,
    y: (availableH - displayH) / 2,
  };
}

function buildPathFromPoints(points: DrawingPoint[]) {
  if (points.length === 0) return null;
  const path = Skia.Path.Make();
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  path.simplify();
  return path;
}

export default function ImageEditor({
  visible,
  imageUri,
  imageWidth,
  imageHeight,
  fileName,
  onCancel,
  onConfirm,
}: ImageEditorProps) {
  const [mode, setMode] = useState<"crop" | "draw">("crop");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(4);
  const [completedStrokes, setCompletedStrokes] = useState<CompletedStroke[]>(
    []
  );
  const [currentPoints, setCurrentPoints] = useState<DrawingPoint[]>([]);
  const [saving, setSaving] = useState(false);

  const canvasRef = useCanvasRef();
  const skiaImage = useImage(imageUri);

  const imageFit = useMemo(
    () => fitImage(imageWidth, imageHeight, SCREEN_W, SCREEN_H),
    [imageWidth, imageHeight]
  );

  const cropX = useSharedValue(imageFit.x + imageFit.width * 0.1);
  const cropY = useSharedValue(imageFit.y + imageFit.height * 0.1);
  const cropW = useSharedValue(imageFit.width * 0.8);
  const cropH = useSharedValue(imageFit.height * 0.8);

  const clampCrop = useCallback(() => {
    "worklet";
    const minX = imageFit.x;
    const minY = imageFit.y;
    const maxX = imageFit.x + imageFit.width;
    const maxY = imageFit.y + imageFit.height;

    if (cropX.value < minX) cropX.value = minX;
    if (cropY.value < minY) cropY.value = minY;
    if (cropX.value + cropW.value > maxX) {
      cropW.value = maxX - cropX.value;
    }
    if (cropY.value + cropH.value > maxY) {
      cropH.value = maxY - cropY.value;
    }
    if (cropW.value < MIN_CROP_SIZE) cropW.value = MIN_CROP_SIZE;
    if (cropH.value < MIN_CROP_SIZE) cropH.value = MIN_CROP_SIZE;
  }, [imageFit, cropX, cropY, cropW, cropH]);

  const overlayPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addRect(Skia.XYWHRect(0, 0, SCREEN_W, SCREEN_H));
    path.addRect(
      Skia.XYWHRect(cropX.value, cropY.value, cropW.value, cropH.value)
    );
    path.setFillType(FillType.EvenOdd);
    return path;
  });

  const completedPaths = useMemo(
    () =>
      completedStrokes
        .map((stroke) => buildPathFromPoints(stroke.points))
        .filter((p): p is NonNullable<typeof p> => p !== null),
    [completedStrokes]
  );

  const currentPath = useMemo(
    () => buildPathFromPoints(currentPoints),
    [currentPoints]
  );

  const tlAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value - HANDLE_SIZE / 2,
    top: cropY.value - HANDLE_SIZE / 2,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
  }));

  const trAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value + cropW.value - HANDLE_SIZE / 2,
    top: cropY.value - HANDLE_SIZE / 2,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
  }));

  const blAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value - HANDLE_SIZE / 2,
    top: cropY.value + cropH.value - HANDLE_SIZE / 2,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
  }));

  const brAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value + cropW.value - HANDLE_SIZE / 2,
    top: cropY.value + cropH.value - HANDLE_SIZE / 2,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
  }));

  const centerAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value,
    top: cropY.value,
    width: cropW.value,
    height: cropH.value,
  }));

  const handleDrawStart = useCallback(
    (x: number, y: number) => {
      setCurrentPoints([{ x, y }]);
    },
    []
  );

  const handleDrawChange = useCallback((x: number, y: number) => {
    setCurrentPoints((prev) => [...prev, { x, y }]);
  }, []);

  const handleDrawEnd = useCallback(() => {
    setCurrentPoints((prev) => {
      if (prev.length === 0) return prev;
      setCompletedStrokes((strokes) => [
        ...strokes,
        {
          points: prev,
          color: selectedColor,
          strokeWidth: selectedStrokeWidth,
        },
      ]);
      return [];
    });
  }, [selectedColor, selectedStrokeWidth]);

  const makeCornerGesture = useCallback(
    (corner: "tl" | "tr" | "bl" | "br") =>
      Gesture.Pan()
        .onChange((e) => {
          if (corner === "tl") {
            cropX.value += e.changeX;
            cropY.value += e.changeY;
            cropW.value -= e.changeX;
            cropH.value -= e.changeY;
          } else if (corner === "tr") {
            cropY.value += e.changeY;
            cropW.value += e.changeX;
            cropH.value -= e.changeY;
          } else if (corner === "bl") {
            cropX.value += e.changeX;
            cropW.value -= e.changeX;
            cropH.value += e.changeY;
          } else {
            cropW.value += e.changeX;
            cropH.value += e.changeY;
          }
          clampCrop();
        }),
    [clampCrop, cropX, cropY, cropW, cropH]
  );

  const centerGesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          cropX.value += e.changeX;
          cropY.value += e.changeY;
          clampCrop();
        }),
    [clampCrop, cropX, cropY]
  );

  const drawGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart((e) => {
          runOnJS(handleDrawStart)(e.x, e.y);
        })
        .onChange((e) => {
          runOnJS(handleDrawChange)(e.x, e.y);
        })
        .onEnd(() => {
          runOnJS(handleDrawEnd)();
        }),
    [handleDrawStart, handleDrawChange, handleDrawEnd]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const image = canvasRef.current?.makeImageSnapshot({
        x: cropX.value + 2,
        y: cropY.value + 2,
        width: cropW.value - 4,
        height: cropH.value - 4,
      });
      if (!image) {
        setSaving(false);
        return;
      }
      const base64 = image.encodeToBase64();
      const fname = "edited_img_" + Date.now() + ".png";
      const file = new File(Paths.cache, fname);
      file.write(base64, { encoding: "base64" });
      const finalW = Math.round(cropW.value - 4);
      const finalH = Math.round(cropH.value - 4);
      onConfirm({
        uri: file.uri,
        width: finalW,
        height: finalH,
        fileName: fileName
          ? "edited_" + fileName
          : "edited_image_" + Date.now() + ".png",
      });
    } catch {
      setSaving(false);
    }
  }, [cropX, cropY, cropW, cropH, fileName, onConfirm, canvasRef]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <GestureHandlerRootView style={styles.container}>
        <Canvas style={styles.canvas} ref={canvasRef}>
          {skiaImage && (
            <SkiaImage
              image={skiaImage}
              x={imageFit.x}
              y={imageFit.y}
              width={imageFit.width}
              height={imageFit.height}
              fit="fill"
            />
          )}

          {completedStrokes.map((stroke, i) => {
            const path = completedPaths[i];
            if (!path) return null;
            return (
              <Path
                key={i}
                path={path}
                color={stroke.color}
                style="stroke"
                strokeWidth={stroke.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            );
          })}

          {mode === "draw" && currentPath && (
            <Path
              path={currentPath}
              color={selectedColor}
              style="stroke"
              strokeWidth={selectedStrokeWidth}
              strokeCap="round"
              strokeJoin="round"
            />
          )}

          {mode === "crop" && (
            <>
              <Path path={overlayPath} color="rgba(0,0,0,0.55)" />
              <Rect
                x={cropX}
                y={cropY}
                width={cropW}
                height={cropH}
                color="white"
                style="stroke"
                strokeWidth={1.5}
              />
            </>
          )}
        </Canvas>

        {!skiaImage && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {mode === "crop" && (
          <>
            <GestureDetector gesture={centerGesture}>
              <Animated.View style={centerAnimatedStyle} />
            </GestureDetector>
            <GestureDetector gesture={makeCornerGesture("tl")}>
              <Animated.View style={tlAnimatedStyle}>
                <View style={styles.cornerHandle} />
              </Animated.View>
            </GestureDetector>
            <GestureDetector gesture={makeCornerGesture("tr")}>
              <Animated.View style={trAnimatedStyle}>
                <View style={styles.cornerHandle} />
              </Animated.View>
            </GestureDetector>
            <GestureDetector gesture={makeCornerGesture("bl")}>
              <Animated.View style={blAnimatedStyle}>
                <View style={styles.cornerHandle} />
              </Animated.View>
            </GestureDetector>
            <GestureDetector gesture={makeCornerGesture("br")}>
              <Animated.View style={brAnimatedStyle}>
                <View style={styles.cornerHandle} />
              </Animated.View>
            </GestureDetector>
          </>
        )}

        {mode === "draw" && (
          <GestureDetector gesture={drawGesture}>
            <Animated.View style={StyleSheet.absoluteFill} />
          </GestureDetector>
        )}

        <View style={styles.topBar}>
          <TouchableOpacity onPress={onCancel} style={styles.topBarButton}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.modeTabs}>
            <TouchableOpacity
              style={[styles.modeTab, mode === "crop" && styles.modeTabActive]}
              onPress={() => setMode("crop")}
            >
              <Text
                style={[
                  styles.modeTabText,
                  mode === "crop" && styles.modeTabTextActive,
                ]}
              >
                Crop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, mode === "draw" && styles.modeTabActive]}
              onPress={() => setMode("draw")}
            >
              <Text
                style={[
                  styles.modeTabText,
                  mode === "draw" && styles.modeTabTextActive,
                ]}
              >
                Draw
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={styles.doneButton}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="checkmark" size={26} color="#033563" />
            )}
          </TouchableOpacity>
        </View>

        {mode === "draw" && (
          <View style={styles.bottomBar}>
            <View style={styles.colorPalette}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    color === "#FFFFFF" && styles.whiteSwatch,
                    selectedColor === color && styles.colorSwatchSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            <View style={styles.strokeWidthRow}>
              {STROKE_WIDTHS.map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[
                    styles.strokeWidthOption,
                    selectedStrokeWidth === w &&
                      styles.strokeWidthOptionSelected,
                  ]}
                  onPress={() => setSelectedStrokeWidth(w)}
                >
                  <View
                    style={[
                      styles.strokeWidthDot,
                      {
                        width: w + 2,
                        height: w + 2,
                        borderRadius: (w + 2) / 2,
                        backgroundColor:
                          selectedStrokeWidth === w
                            ? "#fff"
                            : "rgba(255,255,255,0.5)",
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  canvas: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  cornerHandle: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
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
  modeTabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    overflow: "hidden",
  },
  modeTab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  modeTabActive: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
  },
  modeTabText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "600",
  },
  modeTabTextActive: {
    color: "#033563",
  },
  doneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_BAR_H,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  colorPalette: {
    flexDirection: "row",
    gap: 10,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  whiteSwatch: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  strokeWidthRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  strokeWidthOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  strokeWidthOptionSelected: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  strokeWidthDot: {},
});
