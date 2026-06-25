import { useThemeColor } from "@/hooks/use-theme-color";
import { Modal, StyleSheet, View } from "react-native";
import LoaderIcon from "../icons/loader-icon";

export default function Loader({ visible }: { visible: boolean }) {
  const loaderBg = useThemeColor({}, "loaderBg");
  const defaultColor = useThemeColor({}, "loaderDefault");
  const pillLeftColor = useThemeColor({}, "loaderPillLeft");
  const pillRightColor = useThemeColor({}, "loaderPillRight");

  return (
    <Modal transparent visible={visible} animationType="fade" style={{ flex: 1 }}>
      <View style={styles.overlay}>
        <View style={[{ backgroundColor: loaderBg }, styles.loaderContainer]}>
          <LoaderIcon
            defaultColor={defaultColor}
            pillLeftColor={pillLeftColor}
            pillRightColor={pillRightColor}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    position: "relative",
    width: 130,
    height: 130,
    borderRadius: 130,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3.583 },
    shadowOpacity: 0.5,
    shadowRadius: 7.167,
    elevation: 5,
  },
});
