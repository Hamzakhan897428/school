import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QuickActionItem, QuickActionItemProps } from "./QuickActionItem";
import { AppCard } from "./AppCard";
import { THEME } from "../theme/colors";

export type ModuleItem = Omit<QuickActionItemProps, "onPress" | "className">;

export interface AcademicModulesProps {
  title?: string;
  subtitle?: string;
  modules?: ModuleItem[];
  className?: string;
  onItemPress?: (item: ModuleItem) => void;
}

export const DEFAULT_ACADEMIC_MODULES: ModuleItem[] = [
  // Row 1
  {
    id: "fees",
    label: "Fee Portal",
    icon: <Feather name="credit-card" size={23} color={THEME.primary} />,
    route: "/fees",
    badgeCount: 1,
  },
  {
    id: "results",
    label: "Exam Results",
    icon: <Feather name="file-text" size={23} color={THEME.primary} />,
    route: "/results",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <Feather name="check-circle" size={23} color={THEME.primary} />,
    route: "/attendance",
  },

  // Row 2
  {
    id: "notices",
    label: "Notices",
    icon: <Feather name="bell" size={23} color={THEME.primary} />,
    route: "/notices",
    badgeCount: 2,
  },
  {
    id: "timetable",
    label: "Timetable",
    icon: <Feather name="clock" size={23} color={THEME.primary} />,
    route: "/timetable",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Feather name="calendar" size={23} color={THEME.primary} />,
    route: "/calendar",
  },

  // Row 3
  {
    id: "homework",
    label: "Homework & Tasks",
    icon: <Feather name="book-open" size={23} color={THEME.primary} />,
    route: "/notices",
    badgeCount: 3,
  },
];

export const AcademicModules: React.FC<AcademicModulesProps> = ({
  title = "Academic Modules",
  subtitle = "Quick student actions & records",
  modules = DEFAULT_ACADEMIC_MODULES,
  className = "",
  onItemPress,
}) => {
  return (
    <AppCard className={`bg-card rounded-3xl p-4.5 border border-border shadow-sm ${className}`}>
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-2 px-1.5">
        <View>
          <Text className="text-[16px] font-bold text-main tracking-tight">
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-[12px] text-muted mt-0.5 font-medium">
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View className="bg-primary-soft px-2.5 py-1 rounded-full">
          <Text className="text-[11px] font-bold text-primary">
            {modules.length} Services
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-border/60 my-2.5" />

      {/* 3-Column Grid Container */}
      <View className="flex-row flex-wrap -mx-1">
        {modules.map((item) => (
          <QuickActionItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            route={item.route}
            badgeCount={item.badgeCount}
            onPress={onItemPress ? () => onItemPress(item) : undefined}
          />
        ))}
      </View>
    </AppCard>
  );
};

export default AcademicModules;

