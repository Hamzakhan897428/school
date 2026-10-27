import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { router } from "expo-router";

export interface ActionModuleCardProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  badgeCount?: number;
  badgeVariant?: "danger" | "primary";
  onPress?: () => void;
  className?: string;
  containerClassName?: string;
  isRTL?: boolean;
}

export const ActionModuleCard: React.FC<ActionModuleCardProps> = ({
  label,
  icon,
  route,
  badgeCount,
  badgeVariant = "danger",
  onPress,
  className = "",
  containerClassName = "w-1/3",
  isRTL = false,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(route as any);
    }
  };

  const isDangerBadge = badgeVariant === "danger";

  return (
    <View className={`${containerClassName} p-1.5 ${className}`}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm items-center justify-center min-h-[118px]"
      >
        {/* Circular Icon Container with Floating Badge */}
        <View className="relative mb-2">
          {/* Increased Size Fully Round Circular Badge */}
          <View className="w-[56px] h-[56px] rounded-2xl bg-[#EEF2FF] items-center justify-center shadow-xs">
            {icon}
          </View>

          {/* Floating Pill Notification Badge */}
          {typeof badgeCount === "number" && badgeCount > 0 && (
            <View
              className={`absolute -top-1 ${
                isRTL ? "-left-1" : "-right-1"
              } px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] items-center justify-center border-2 border-white shadow-xs ${
                isDangerBadge ? "bg-[#FEE2E2]" : "bg-[#E0E7FF]"
              }`}
            >
              <Text
                className={`text-[10.5px] font-extrabold leading-none ${
                  isDangerBadge ? "text-[#EF4444]" : "text-[#4F46E5]"
                }`}
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </Text>
            </View>
          )}
        </View>

        {/* Crisp Label */}
        <Text
          numberOfLines={1}
          className="text-[14px] font-bold text-gray-900 text-center tracking-tight"
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionModuleCard;
