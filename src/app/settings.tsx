import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { DeviceSession } from "../types/api";

export default function SettingsScreen() {
  const { user, logout, setLocale } = useAuth();
  const [isUrdu, setIsUrdu] = useState<boolean>(user?.locale === "ur");
  const [devices, setDevices] = useState<DeviceSession[]>([]);

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

  const handleSelectLanguage = (lang: "en" | "ur") => {
    setIsUrdu(lang === "ur");
    setLocale(lang);
  };

  const toggleLanguage = () => {
    const nextLang = isUrdu ? "en" : "ur";
    setIsUrdu(!isUrdu);
    setLocale(nextLang);
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
            await logout();
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
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              className="w-11 h-11 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={21} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-[19px] font-bold text-gray-900 tracking-tight">
              {isUrdu ? "مزید" : "More"}
            </Text>
          </View>

          {/* Top Language Toggle Pill */}
          <TouchableOpacity
            onPress={toggleLanguage}
            activeOpacity={0.7}
            className="bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-xs"
          >
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
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => handleSelectLanguage("en")}
              activeOpacity={0.8}
              className={`flex-1 py-3.5 rounded-2xl items-center justify-center mr-2 ${
                !isUrdu ? "bg-[#4645F6] shadow-xs" : "bg-[#F8F9FA]"
              }`}
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
              className={`flex-1 py-3.5 rounded-2xl items-center justify-center ml-2 ${
                isUrdu ? "bg-[#4645F6] shadow-xs" : "bg-[#F8F9FA]"
              }`}
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
            className={`text-[15px] font-bold text-gray-900 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {devices[0]?.label || (isUrdu ? "یہ فون" : "This phone")}
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
          className={`text-[13px] text-gray-400 font-medium px-2 mb-4 ${
            isUrdu ? "text-right" : "text-left"
          }`}
        >
          {user?.phone || "+923451688953"}
        </Text>

        {/* Sign Out Action Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.7}
          className="bg-white rounded-3xl py-4 border border-gray-100 shadow-sm flex-row items-center justify-center"
        >
          <Feather name="log-out" size={17} color="#1F2937" />
          <Text className="text-[15px] font-bold text-gray-900 ml-2">
            {isUrdu ? "سائن آؤٹ" : "Sign out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

