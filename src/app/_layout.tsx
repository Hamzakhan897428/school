import "../../global.css";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "../context/AuthContext";

/**
 * Standardized Custom Header Component for Expo Router Stack Navigation
 *
 * - Left: Circular 40x40 back arrow button that pops the route with fallback
 * - Center: Active screen name centered in bold typography
 * - Right: Balanced spacer or custom headerRight node
 * - Respects safe area / status bar padding on both Android and iOS
 */
export function GlobalModuleHeader({ options, route, back }: any) {
  const insets = useSafeAreaInsets();
  const title = options?.title || route?.name || "Module";

  return (
    <View
      style={{ paddingTop: insets.top + 6, paddingBottom: 10 }}
      className="w-full bg-[#F8F9FA] px-5 flex-row items-center justify-between"
    >
      {/* Left Slot: Circular Back Button */}
      <View className="w-10 items-start justify-center">
        {back ? (
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/dashboard");
              }
            }}
            activeOpacity={0.7}
            accessibilityLabel="Back"
            accessibilityRole="button"
            className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center"
          >
            <Ionicons name="arrow-back" size={21} color="#1F2937" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center Slot: Dynamic Bold Screen Title */}
      <View className="flex-1 items-center justify-center px-2">
        <Text
          numberOfLines={1}
          className="text-[17px] font-bold text-gray-900 tracking-tight text-center"
        >
          {title}
        </Text>
      </View>

      {/* Right Slot: Symmetrical 40px Spacer or Action Node */}
      <View className="w-10 items-end justify-center">
        {options?.headerRight ? options.headerRight() : <View className="w-10" />}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          header: (props) => <GlobalModuleHeader {...props} />,
          headerShown: false, // Screens can toggle headerShown: true to use this global header
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="attendance" options={{ title: "Attendance" }} />
        <Stack.Screen name="homework" options={{ title: "Homework" }} />
        <Stack.Screen name="fees" options={{ title: "Fees" }} />
        <Stack.Screen name="results" options={{ title: "Results" }} />
        <Stack.Screen name="notices" options={{ title: "Notices" }} />
        <Stack.Screen name="timetable" options={{ title: "Timetable" }} />
        <Stack.Screen name="calendar" options={{ title: "Calendar" }} />
        <Stack.Screen name="settings" options={{ title: "More" }} />
      </Stack>
    </AuthProvider>
  );
}
