import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthCard } from "../components/AuthCard";
import { CustomInput } from "../components/CustomInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";

type Language = "en" | "ur";

interface ContentStrings {
  languageButton: string;
  welcome: string;
  description: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  signIn: string;
  footerNote: string;
}

const STRINGS: Record<Language, ContentStrings> = {
  en: {
    languageButton: "اردو",
    welcome: "Welcome",
    description:
      "Sign in with the mobile number or email your school has on record and the password they gave you.",
    identifierLabel: "Mobile number or email",
    identifierPlaceholder: "Enter your email or number",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show",
    hidePassword: "Hide",
    signIn: "Sign in",
    footerNote:
      "Forgot your password or never got one? Please ask your school office.",
  },
  ur: {
    languageButton: "English",
    welcome: "خوش آمدید",
    description:
      "اسکول کے ریکارڈ میں درج موبائل نمبر یا ای میل اور اسکول کا دیا ہوا پاس ورڈ لکھ کر سائن ان کریں۔",
    identifierLabel: "موبائل نمبر یا ای میل",
    identifierPlaceholder: "اپنا ای میل یا موبائل نمبر درج کریں",
    passwordLabel: "پاس ورڈ",
    passwordPlaceholder: "پاس ورڈ درج کریں",
    showPassword: "دکھائیں",
    hidePassword: "چھپائیں",
    signIn: "سائن ان کریں",
    footerNote:
      "پاس ورڈ بھول گئے یا کبھی ملا ہی نہیں؟ براہ کرم اسکول کے دفتر سے پوچھیں۔",
  },
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [lang, setLang] = useState<Language>("en");
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Animated translateY to physically push the entire form upward above the keyboard
  const translateY = useRef(new Animated.Value(0)).current;
  const passwordInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const moveUp = () => {
    Animated.spring(translateY, {
      toValue: -160, // Smoothly lifts the form by 160px
      damping: 20,
      mass: 0.8,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  const moveDown = () => {
    Animated.spring(translateY, {
      toValue: 0,
      damping: 20,
      mass: 0.8,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  // Monitor keyboard display events on both Android and iOS
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, moveUp);
    const hideSub = Keyboard.addListener(hideEvent, moveDown);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isRTL = lang === "ur";
  const content = STRINGS[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ur" : "en"));
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    moveDown();
  };

  const handleSignIn = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert(
        lang === "ur" ? "ضروری معلومات" : "Required Field",
        lang === "ur"
          ? "براہ کرم موبائل نمبر اور پاس ورڈ درج کریں۔"
          : "Please enter your mobile number and password."
      );
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password.trim());
      setLoading(false);
      router.replace("/dashboard");
    } catch (err: any) {
      setLoading(false);
      const msg =
        err?.message ||
        (lang === "ur"
          ? "موبائل نمبر یا پاس ورڈ درست نہیں ہے۔"
          : "That ID or password is incorrect.");
      Alert.alert(lang === "ur" ? "سائن ان کی خرابی" : "Sign in error", msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-app">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={handleDismissKeyboard} accessible={false}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 60,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            className="px-6 py-4"
          >
            {/* Top Language Toggle Pill */}
            <View
              className={`w-full flex-row ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <TouchableOpacity
                onPress={toggleLanguage}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="bg-card px-5 py-2 rounded-full border border-border shadow-sm"
              >
                <Text className="text-primary font-medium text-[15px]">
                  {content.languageButton}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Animated Form Container: Physically springs upward when keyboard appears */}
            <Animated.View style={{ transform: [{ translateY }] }}>
              {/* Header Section */}
              <View className="items-center mt-6">
                {/* School / Graduation Cap Icon Squircle Badge */}
                <View className="w-[72px] h-[72px] bg-primary rounded-[22px] items-center justify-center shadow-md">
                  <Ionicons name="school" size={38} color="#FFFFFF" />
                </View>

                {/* Welcome Title */}
                <Text className="text-[26px] font-bold text-main mt-5 text-center tracking-tight">
                  {content.welcome}
                </Text>

                {/* Subtitle Description */}
                <Text className="text-[14px] text-muted mt-2.5 text-center leading-5 px-3 max-w-[320px]">
                  {content.description}
                </Text>
              </View>

              {/* Card Container */}
              <View className="mt-7 w-full max-w-[420px] self-center">
                <AuthCard>
                  {/* Identifier Input */}
                  <CustomInput
                    label={content.identifierLabel}
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder={content.identifierPlaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    isRTL={isRTL}
                    returnKeyType="next"
                    onFocus={moveUp}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                    containerClassName="mb-4"
                  />

                  {/* Password Input */}
                  <CustomInput
                    ref={passwordInputRef}
                    label={content.passwordLabel}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={content.passwordPlaceholder}
                    isPassword
                    isRTL={isRTL}
                    returnKeyType="done"
                    showPasswordText={content.showPassword}
                    hidePasswordText={content.hidePassword}
                    onFocus={moveUp}
                    onSubmitEditing={handleSignIn}
                    containerClassName="mb-6"
                  />

                  {/* Sign In Primary Action Button */}
                  <PrimaryButton
                    title={content.signIn}
                    onPress={handleSignIn}
                    loading={loading}
                  />

                  {/* Bottom Office Note */}
                  <Text
                    className={`text-[12.5px] text-muted mt-4 leading-4.5 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {content.footerNote}
                  </Text>
                </AuthCard>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
