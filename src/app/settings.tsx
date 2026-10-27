import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";
import { api } from "../api/client";
import { DeviceSession } from "../types/api";

export default function SettingsScreen() {
  const { user, logout, setLocale: setAuthLocale } = useAuth();
  const { locale, isRTL, setLocale: setI18nLocale, toggleLocale } = useI18n();
  const [devices, setDevices] = useState<DeviceSession[]>([]);

  const isUrdu = locale === "ur";

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const list = await api.devices();
        if (Array.isArray(list)) {
          setDevices(list);
        }
      } catch {
        // Fallback to default device view
      }
    };
    loadDevices();
  }, []);

  const handleSelectLanguage = async (lang: "en" | "ur") => {
    await setI18nLocale(lang);
    try {
      await setAuthLocale(lang);
    } catch {
      // Keep optimistic state locally
    }
  };

  const toggleLanguage = async () => {
    const nextLang = locale === "en" ? "ur" : "en";
    await handleSelectLanguage(nextLang);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      isUrdu ? "سائن آؤٹ" : "Sign Out",
      isUrdu
        ? "کیا آپ واقعی پورٹل سے سائن آؤٹ کرنا چاہتے ہیں؟"
        : "Are you sure you want to sign out?",
      [
        {
          text: isUrdu ? "منسوخ کریں" : "Cancel",
          style: "cancel",
        },
        {
          text: isUrdu ? "سائن آؤٹ" : "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch {
              // Ignore network failure
            }
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Navigation */}
        <View
          className={`flex-row items-center justify-between mb-4 ${
            isUrdu ? "flex-row-reverse" : ""
          }`}
        >
          <View className={`flex-row items-center ${isUrdu ? "flex-row-reverse" : ""}`}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Back"
              accessibilityRole="button"
              className={`w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center ${
                isUrdu ? "ml-3" : "mr-3"
              } active:bg-gray-100`}
            >
              <Ionicons
                name={isUrdu ? "arrow-forward" : "arrow-back"}
                size={20}
                color="#1F2937"
              />
            </TouchableOpacity>

            <Text className="text-[19px] font-bold text-gray-900 tracking-tight">
              {isUrdu ? "مزید" : "Settings"}
            </Text>
          </View>

          {/* Top Language Toggle Pill */}
          <TouchableOpacity
            onPress={toggleLanguage}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-xs active:bg-gray-50 flex-row items-center"
          >
            <Ionicons
              name="globe-outline"
              size={14}
              color="#4F46E5"
              style={{ marginRight: isUrdu ? 0 : 5, marginLeft: isUrdu ? 5 : 0 }}
            />
            <Text className="text-[13.5px] font-bold text-[#4F46E5]">
              {isUrdu ? "English" : "اردو"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 1: Language Selection */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
          <Text
            className={`text-[15px] font-bold text-gray-900 mb-3 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "زبان" : "Language"}
          </Text>

          {/* Segmented Buttons for English & Urdu */}
          <View className={`flex-row items-center ${isUrdu ? "flex-row-reverse" : ""}`}>
            <TouchableOpacity
              onPress={() => handleSelectLanguage("en")}
              activeOpacity={0.8}
              className={`flex-1 py-3.5 rounded-2xl items-center justify-center ${
                isUrdu ? "ml-2" : "mr-2"
              } ${!isUrdu ? "bg-[#4645F6] shadow-xs" : "bg-[#F8F9FA]"}`}
            >
              <Text
                className={`text-[15px] font-bold ${
                  !isUrdu ? "text-white" : "text-gray-800"
                }`}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectLanguage("ur")}
              activeOpacity={0.8}
              className={`flex-1 py-3.5 rounded-2xl items-center justify-center ${
                isUrdu ? "mr-2" : "ml-2"
              } ${isUrdu ? "bg-[#4645F6] shadow-xs" : "bg-[#F8F9FA]"}`}
            >
              <Text
                className={`text-[15px] font-bold ${
                  isUrdu ? "text-white" : "text-gray-800"
                }`}
              >
                اردو
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Phones Signed In */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3">
          <Text
            className={`text-[15px] font-bold text-gray-900 mb-3 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "لاگ ان فونز" : "Phones signed in"}
          </Text>

          <Text
            className={`text-[16px] font-bold text-gray-900 tracking-tight ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            +923001601844
          </Text>

          <Text
            className={`text-[13px] text-gray-400 font-medium mt-0.5 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "آخری استعمال: 24 اکتوبر، 17:58" : "Last used 24 Oct, 17:58"}
          </Text>
        </View>

        {/* User Phone Number Display */}
        <Text
          className={`text-[13.5px] font-semibold text-gray-500 px-2 mb-4 tracking-wider ${
            isUrdu ? "text-right" : "text-left"
          }`}
        >
          {user?.phone || "+923001601844"}
        </Text>

        {/* Sign Out Action Button: Logs out and navigates back to sign-in page */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.7}
          className="bg-white rounded-3xl py-4 border border-red-200 shadow-sm flex-row items-center justify-center active:bg-red-50 mt-2"
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text className="text-[15px] font-bold text-red-600 ml-2">
            {isUrdu ? "سائن آؤٹ کریں" : "Sign out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
