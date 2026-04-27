import { useThemeColor } from "@/hooks/use-theme-color";
import { DateTime, formatHomeScreenDate, getWeekDays } from "@/utils/luxonUtil";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ArrowLeft from "../icons/arrow-left";
import ArrowRight from "../icons/arrow-right";

export default function WeekView() {
  const now = DateTime.now();

  const [currentDate, setCurrentDate] = useState(now);
  //   Default to today
  const [selectedISODate, setSelectedISODate] = useState(now.setLocale("ru").toISODate());

  const week = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const goNextWeek = () => {
    setCurrentDate((prev) => prev.plus({ weeks: 1 }));
  };

  const goPrevWeek = () => {
    setCurrentDate((prev) => prev.minus({ weeks: 1 }));
  };

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");

  const handleSetISODate = (ISODate: string) => {
    setSelectedISODate(ISODate);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{formatHomeScreenDate(selectedISODate)}</Text>
      <View style={styles.weekContainer}>
        <Pressable style={styles.weekController} onPress={goPrevWeek}>
          <ArrowLeft size={30} color={color} />
        </Pressable>

        <View style={styles.weekWrapper}>
          {week.map((w) => {
            const isActive = selectedISODate === w.iso;
            return (
              <Pressable
                key={w.iso}
                style={[
                  styles.weekPressable,
                  { borderWidth: isActive ? 1 : 0, borderColor: tintColor },
                ]}
                onPress={() => handleSetISODate(w.iso)}
              >
                <Text style={[styles.weekText, { color: isActive ? tintColor : color }]}>
                  {w.day}
                </Text>
                <Text style={[styles.weekText, { color: isActive ? tintColor : color }]}>
                  {w.date}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.weekController} onPress={goNextWeek}>
          <ArrowRight size={30} color={color} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    gap: 8,
  },
  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  weekContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weekController: {
    width: 20,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  weekWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weekPressable: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
  },
  weekText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    textTransform: "uppercase",
  },
});
