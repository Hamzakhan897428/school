import "../../global.css";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { I18nProvider } from "../i18n";

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Child screens manage their pinned/sticky header component
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="attendance" options={{ headerShown: false }} />
          <Stack.Screen name="homework" options={{ headerShown: false }} />
          <Stack.Screen name="fees" options={{ headerShown: false }} />
          <Stack.Screen name="results" options={{ headerShown: false }} />
          <Stack.Screen name="notices" options={{ headerShown: false }} />
          <Stack.Screen name="timetable" options={{ headerShown: false }} />
          <Stack.Screen name="calendar" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </I18nProvider>
  );
}
