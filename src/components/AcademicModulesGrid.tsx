import React from "react";
import { View, Text } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { ActionModuleCard, ActionModuleCardProps } from "./ActionModuleCard";

export type ActionModuleItem = Omit<
  ActionModuleCardProps,
  "onPress" | "className"
>;

export interface AcademicModulesGridProps {
  title?: string;
  subtitle?: string;
  items?: ActionModuleItem[];
  className?: string;
  onItemPress?: (item: ActionModuleItem) => void;
  isUrdu?: boolean;
}

const BRAND_BLUE = "#4F46E5";

export const URDU_ACADEMIC_MODULES_GRID: ActionModuleItem[] = [
  // Row 1: Homework (left), Attendance (right)
  {
    id: "homework",
    label: "ہوم ورک",
    icon: (
      <MaterialCommunityIcons
        name="book-edit-outline"
        size={29}
        color={BRAND_BLUE}
      />
    ),
    route: "/homework",
  },
  {
    id: "attendance",
    label: "حاضری",
    icon: (
      <MaterialCommunityIcons
        name="calendar-check-outline"
        size={29}
        color={BRAND_BLUE}
      />
    ),
    route: "/attendance",
  },

  // Row 2: Results (left), Fees (right)
  {
    id: "results",
    label: "نتائج",
    icon: <Ionicons name="trophy-outline" size={28} color={BRAND_BLUE} />,
    route: "/results",
  },
  {
    id: "fees",
    label: "فیس",
    icon: <Ionicons name="wallet-outline" size={29} color={BRAND_BLUE} />,
    route: "/fees",
    badgeCount: 1,
    badgeVariant: "danger",
  },

  // Row 3: Timetable (left), Notices (right)
  {
    id: "timetable",
    label: "ٹائم ٹیبل",
    icon: <Feather name="clock" size={28} color={BRAND_BLUE} />,
    route: "/timetable",
  },
  {
    id: "notices",
    label: "اطلاعات",
    icon: <Ionicons name="megaphone-outline" size={28} color={BRAND_BLUE} />,
    route: "/notices",
    badgeCount: 1,
    badgeVariant: "primary",
  },

  // Row 4: Calendar (full width)
  {
    id: "calendar",
    label: "کیلنڈر",
    icon: <Ionicons name="calendar-outline" size={28} color={BRAND_BLUE} />,
    route: "/calendar",
  },
];

export const DEFAULT_ACADEMIC_MODULES_GRID: ActionModuleItem[] = [
  // Row 1
  {
    id: "attendance",
    label: "Attendance",
    icon: (
      <MaterialCommunityIcons
        name="calendar-check"
        size={29}
        color={BRAND_BLUE}
      />
    ),
    route: "/attendance",
  },
  {
    id: "homework",
    label: "Homework",
    icon: (
      <MaterialCommunityIcons
        name="book-edit"
        size={29}
        color={BRAND_BLUE}
      />
    ),
    route: "/homework",
  },
  {
    id: "fees",
    label: "Fees",
    icon: <Ionicons name="wallet-outline" size={29} color={BRAND_BLUE} />,
    route: "/fees",
    badgeCount: 1,
    badgeVariant: "danger",
  },

  // Row 2
  {
    id: "results",
    label: "Results",
    icon: <Ionicons name="trophy-outline" size={28} color={BRAND_BLUE} />,
    route: "/results",
  },
  {
    id: "notices",
    label: "Notices",
    icon: <Ionicons name="megaphone-outline" size={28} color={BRAND_BLUE} />,
    route: "/notices",
    badgeCount: 1,
    badgeVariant: "primary",
  },
  {
    id: "timetable",
    label: "Timetable",
    icon: <Feather name="clock" size={28} color={BRAND_BLUE} />,
    route: "/timetable",
  },

  // Row 3
  {
    id: "calendar",
    label: "Calendar",
    icon: <Ionicons name="calendar-outline" size={28} color={BRAND_BLUE} />,
    route: "/calendar",
  },
];

export const AcademicModulesGrid: React.FC<AcademicModulesGridProps> = ({
  title = "Academic Modules",
  subtitle = "Quick actions & academic services",
  items,
  className = "",
  onItemPress,
  isUrdu = false,
}) => {
  const activeItems =
    items ||
    (isUrdu ? URDU_ACADEMIC_MODULES_GRID : DEFAULT_ACADEMIC_MODULES_GRID);

  if (isUrdu) {
    return (
      <View className={`w-full ${className}`}>
        {/* Urdu 2-Column Responsive Grid matching Reference Screenshot */}
        <View className="flex-row flex-wrap -m-1.5">
          {activeItems.map((item) => {
            const isFullWidth = item.id === "calendar";
            return (
              <ActionModuleCard
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                route={item.route}
                badgeCount={item.badgeCount}
                badgeVariant={item.badgeVariant}
                containerClassName={isFullWidth ? "w-full" : "w-1/2"}
                isRTL={true}
                onPress={onItemPress ? () => onItemPress(item) : undefined}
              />
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View className={`w-full ${className}`}>
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View>
          <Text className="text-[17px] font-bold text-gray-900 tracking-tight">
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-[12px] text-gray-400 mt-0.5 font-medium">
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View className="bg-[#EEF2FF] px-2.5 py-1 rounded-full">
          <Text className="text-[11px] font-bold text-[#4F46E5]">
            {activeItems.length} Modules
          </Text>
        </View>
      </View>

      {/* 3-Cards-Per-Row Responsive Grid */}
      <View className="flex-row flex-wrap -m-1.5">
        {activeItems.map((item) => (
          <ActionModuleCard
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            route={item.route}
            badgeCount={item.badgeCount}
            badgeVariant={item.badgeVariant}
            onPress={onItemPress ? () => onItemPress(item) : undefined}
          />
        ))}
      </View>
    </View>
  );
};

export default AcademicModulesGrid;

