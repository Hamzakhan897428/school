import React from "react";
import { View, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  className = "",
  style,
  onPress,
  activeOpacity = 0.85,
}) => {
  const containerClasses = `bg-card rounded-3xl p-5 border border-border shadow-sm ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={style}
        className={containerClasses}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={style} className={containerClasses}>
      {children}
    </View>
  );
};

export default AppCard;
