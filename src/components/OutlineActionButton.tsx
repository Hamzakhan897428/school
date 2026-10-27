import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { THEME } from "../theme/colors";

interface OutlineActionButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Feather.glyphMap;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export const OutlineActionButton: React.FC<OutlineActionButtonProps> = ({
  title,
  onPress,
  iconName,
  icon,
  className = "",
  size = "md",
}) => {
  const isSmall = size === "sm";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`flex-row items-center justify-center rounded-full border border-primary/40 bg-card active:bg-primary-soft ${
        isSmall ? "px-3.5 py-1.5" : "px-4 py-2.5"
      } ${className}`}
    >
      {icon ? (
        <View className="mr-2">{icon}</View>
      ) : iconName ? (
        <Feather
          name={iconName}
          size={isSmall ? 15 : 17}
          color={THEME.primary}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text
        className={`font-semibold text-primary ${
          isSmall ? "text-[12.5px]" : "text-[14px]"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OutlineActionButton;
