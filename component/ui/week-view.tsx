import { useThemeColor } from "@/hooks/use-theme-color";
import {
  DateTime,
  formatHomeScreenDate,
  getWeekDays,
  getWeekViewDescription,
} from "@/utils/luxonUtil";
import { useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

type WeekViewProps = {
  showDescription: boolean;
  onDateChange: (selectedDate: string) => void;
};
interface WeekDay {
  date: number;
  day: string;
  fullDay: string;
  iso: string;
  isToday: boolean;
}

const WINDOW_PADDING = 20;
const CAROUSEL_WIDTH = Dimensions.get("window").width - WINDOW_PADDING * 2;
const TOTAL_INDEX = 32;
const DATA = [...new Array(TOTAL_INDEX).keys()];
const CENTER_INDEX = TOTAL_INDEX / 2;

export default function WeekView({ showDescription, onDateChange }: WeekViewProps) {
  const now = DateTime.now();
  const carouselRef = useRef<ICarouselInstance>(null);
  const [selectedISODate, setSelectedISODate] = useState(now.setLocale("ru").toISODate());
  const [activeOffset, setActiveOffset] = useState(0);

  const handleOnSnapToItem = (index: number) => {
    const offset = index - CENTER_INDEX;
    setActiveOffset(offset);
  };

  const scrollToCurrentWeek = () => {
    carouselRef.current?.scrollTo({
      index: CENTER_INDEX,
      animated: true,
    });
  };

  const handleSetISODate = (ISODate: string) => {
    setSelectedISODate(ISODate);
    onDateChange(ISODate);
  };

  const description = getWeekViewDescription(selectedISODate);
  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.container}>
      <View style={styles.headerConteainer}>
        <Text style={[styles.title, { color }]}>{formatHomeScreenDate(selectedISODate)}</Text>
        {activeOffset !== 0 && (
          <Pressable onPress={scrollToCurrentWeek}>
            <Text style={[styles.title, { color: tintColor }]}>На этой неделе!</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.weekPageContainer}>
        <Carousel
          ref={carouselRef}
          loop={false}
          defaultIndex={CENTER_INDEX}
          data={DATA}
          width={CAROUSEL_WIDTH}
          height={80}
          style={{ width: CAROUSEL_WIDTH }}
          onSnapToItem={handleOnSnapToItem}
          renderItem={({ index }) => {
            const offset = index - CENTER_INDEX;
            const weeks = getWeekDays(offset);
            return (
              <WeekDayRow
                weeks={weeks}
                selectedISODate={selectedISODate}
                handleSetISODate={handleSetISODate}
              />
            );
          }}
        />
      </View>
      {showDescription && (
        <Text style={[styles.weekDescription, { color }]}>Лекарства на {description}</Text>
      )}
    </View>
  );
}

const WeekDayRow = ({
  weeks,
  selectedISODate,
  handleSetISODate,
}: {
  weeks: WeekDay[];
  selectedISODate: string;
  handleSetISODate: (isoDate: string) => void;
}) => {
  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  return (
    <View style={styles.weekWrapper}>
      {weeks.map((week) => {
        const isActive = selectedISODate === week.iso;
        return (
          <Pressable
            key={week.iso}
            style={[
              styles.weekPressable,
              { borderWidth: isActive ? 1 : 0, borderColor: tintColor },
            ]}
            onPress={() => handleSetISODate(week.iso)}
          >
            <Text style={[styles.weekText, { color: isActive ? tintColor : color }]}>
              {week.day}
            </Text>
            <Text style={[styles.weekText, { color: isActive ? tintColor : color }]}>
              {week.date}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    height: "100%",
  },
  headerConteainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerPressabaleText: {},
  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  weekPageContainer: {
    flex: 1,
  },
  weekContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  weekDescription: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    lineHeight: 22,
  },
});
