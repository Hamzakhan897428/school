import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  className = "",
  style,
}) => {
  return (
    <View
      style={style}
      className={`bg-card rounded-3xl p-6 shadow-sm border border-border ${className}`}
    >
      {children}
    </View>
  );
};

export default AuthCard;
