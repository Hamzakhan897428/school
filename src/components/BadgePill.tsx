import React from "react";
import { View, Text } from "react-native";
import { StatusVariant } from "../types/portal";

interface BadgePillProps {
  label: string;
  variant?: StatusVariant;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

const VARIANT_STYLES: Record<
  StatusVariant,
  { container: string; text: string }
> = {
  success: {
    container: "bg-status-success-bg border border-status-success/30",
    text: "text-status-success",
  },
  warning: {
    container: "bg-status-warning-bg border border-status-warning/30",
    text: "text-status-warning",
  },
  danger: {
    container: "bg-status-danger-bg border border-status-danger/30",
    text: "text-status-danger",
  },
  info: {
    container: "bg-primary-soft border border-primary/25",
    text: "text-primary",
  },
  neutral: {
    container: "bg-app border border-border",
    text: "text-muted",
  },
};

export const BadgePill: React.FC<BadgePillProps> = ({
  label,
  variant = "neutral",
  icon,
  className = "",
  size = "md",
}) => {
  const currentVariant = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  const textSizeClass = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <View
      className={`flex-row items-center rounded-full self-start ${sizeClasses} ${currentVariant.container} ${className}`}
    >
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text
        className={`font-semibold tracking-wide capitalize ${textSizeClass} ${currentVariant.text}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default BadgePill;
