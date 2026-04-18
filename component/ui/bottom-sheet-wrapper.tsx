import { useThemeColor } from "@/hooks/use-theme-color";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import React, {
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface BottomSheetWrapperRef {
  open: () => void;
  close: () => void;
}

type BottomSheetWrapperProps = {
  children: React.ReactNode;
  ref: RefObject<BottomSheetWrapperRef | null>;
  title: string;
  snapPointPercent?: string;
};

interface HandleProps {
  borderColor: string;
  tintColor: string;
  textColor: string;
  close: () => void;
  title: string;
}

export default function BottomSheetWrapper({
  children,
  ref,
  title,
  snapPointPercent = "100%",
}: BottomSheetWrapperProps) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(
    () => ["1%", snapPointPercent],
    [snapPointPercent],
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index <= 1) {
      bottomSheetRef.current?.close();
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        bottomSheetRef.current?.expand();
      },
      close() {
        bottomSheetRef.current?.close();
      },
    }),
    [],
  );

  // Backdrops
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  // Themes colors
  const backgroundColor = useThemeColor({}, "bottomSheetBg");
  const color = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");
  const tint = useThemeColor({}, "tint");

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        topInset={insets.top}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleComponent={() => (
          <Handle
            borderColor={borderColor}
            tintColor={tint}
            textColor={color}
            close={closeBottomSheet}
            title={title}
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
}

const Handle: React.FC<HandleProps> = ({
  borderColor,
  tintColor,
  textColor,
  close,
  title,
}) => {
  return (
    <View style={[styles.header, { borderColor }]}>
      <Pressable style={styles.headerPressable} onPress={close}>
        <Text style={[styles.headerPressableText, { color: tintColor }]}>
          Отмена
        </Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      <View style={styles.headerGhostView} />
    </View>
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
