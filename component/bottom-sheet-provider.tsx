import { useThemeColor } from "@/hooks/use-theme-color";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OpenOptions {
  title: string;
  snapPointPercent?: string;
  content: React.ReactNode;
}

interface BottomSheetContextValue {
  openSheet: (options: OpenOptions) => void;
  closeSheet: () => void;
}

interface HandleProps {
  borderColor: string;
  tintColor: string;
  textColor: string;
  title: string;
  close: () => void;
  animatedIndex: SharedValue<number>;
}

const BottomSheetContext = createContext<BottomSheetContextValue>({
  openSheet: () => {},
  closeSheet: () => {},
});

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const timeoutId = useRef<NodeJS.Timeout>(null);

  const [title, setTitle] = useState<string>("");
  const [snapPointPercent, setSnapPointPercent] = useState("100%");
  const [content, setContent] = useState<React.ReactNode>(null);

  const snapPoints = useMemo(() => ["1%", snapPointPercent], [snapPointPercent]);

  const openSheet = useCallback(({ title, snapPointPercent = "100%", content }: OpenOptions) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    setTitle(title);
    setSnapPointPercent(snapPointPercent);
    setContent(content);

    timeoutId.current = setTimeout(() => bottomSheetRef.current?.expand(), 150);
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index <= 1) {
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={1} appearsOnIndex={2} />,
    [],
  );

  // Themes colors
  const backgroundColor = useThemeColor({}, "bottomSheetBg");
  const color = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");
  const tint = useThemeColor({}, "tint");

  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        topInset={insets.top}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior="restore"
        backgroundStyle={{
          backgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleComponent={(variables) => (
          <Handle
            borderColor={borderColor}
            tintColor={tint}
            textColor={color}
            close={closeSheet}
            title={title}
            animatedIndex={variables.animatedIndex}
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>{content}</BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
}

const Handle: React.FC<HandleProps> = ({
  borderColor,
  tintColor,
  textColor,
  close,
  title,
  animatedIndex,
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: animatedIndex.value < 1 ? 0 : 1,
    };
  });
  return (
    <Animated.View style={[styles.header, { borderColor }, animatedStyles]}>
      <Pressable style={styles.headerPressable} onPress={close}>
        <Text style={[styles.headerPressableText, { color: tintColor }]}>Отмена</Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      <View style={styles.headerGhostView} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerPressable: {
    width: 55,
    height: 21,
    justifyContent: "center",
  },
  headerPressableText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 21,
  },
  headerGhostView: {
    width: 55,
  },
});

export const useBottomSheet = () => useContext(BottomSheetContext);
