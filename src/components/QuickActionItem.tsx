import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { router } from "expo-router";

export interface QuickActionItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  badgeCount?: number;
  onPress?: () => void;
  className?: string;
}

export const QuickActionItem: React.FC<QuickActionItemProps> = ({
  label,
  icon,
  route,
  badgeCount,
  onPress,
  className = "",
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(route as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-1/3 items-center py-2.5 px-1 ${className}`}
    >
      {/* Icon Squircle Container with Notification Badge */}
      <View className="relative mb-2">
        {/* Soft Tinted Squircle Badge */}
        <View className="w-13 h-13 rounded-2xl bg-primary-soft items-center justify-center shadow-xs">
          {icon}
        </View>

        {/* Floating Notification Badge Pill (Top-Right) */}
        {typeof badgeCount === "number" && badgeCount > 0 && (
          <View className="absolute -top-1.5 -right-2 bg-status-danger rounded-full min-w-[19px] h-[19px] px-1 items-center justify-center border-2 border-card shadow-xs">
            <Text className="text-card text-[10px] font-extrabold leading-none">
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </View>

      {/* Short Crisp Label (Centered with 2-line wrap) */}
      <Text
        numberOfLines={2}
        className="text-[12px] font-semibold text-main text-center leading-4 max-w-[85px] tracking-tight"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default QuickActionItem;

