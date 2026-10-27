import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthCard } from "../components/AuthCard";
import { CustomInput } from "../components/CustomInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LoginScreen() {
  const { login } = useAuth();
  const { t, locale, isRTL, toggleLocale } = useI18n();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [identifierError, setIdentifierError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const passwordInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  // Monitor keyboard display events to smoothly collapse the top banner
  // and make sure inputs & action buttons are fully visible above the keyboard
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    if (identifierError) setIdentifierError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
  };

  const handleIdentifierFocus = () => {
    if (identifierError) setIdentifierError("");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 30, animated: true });
    }, 120);
  };

  const handlePasswordFocus = () => {
    if (passwordError) setPasswordError("");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 120, animated: true });
    }, 120);
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignIn = async () => {
    let hasError = false;

    if (!identifier.trim()) {
      setIdentifierError(t("auth.invalidIdentifier"));
      hasError = true;
    } else {
      setIdentifierError("");
    }

    if (!password.trim()) {
      setPasswordError(t("auth.invalidPassword"));
      hasError = true;
    } else {
      setPasswordError("");
    }

    // Stop execution and show inline red text errors without popping up required field alert
    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password.trim());
      setLoading(false);
      router.replace("/dashboard");
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || t("auth.signInErrorDesc");
      setPasswordError(msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-app" edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={handleDismissKeyboard} accessible={false}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardVisible ? 260 : 40,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            className="px-6 py-3"
          >
            {/* Top Language Toggle Pill */}
            <View
              className={`w-full flex-row ${
                isRTL ? "justify-start" : "justify-end"
              } mb-2`}
            >
              <TouchableOpacity
                onPress={toggleLocale}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Switch Language"
                className="bg-card px-4 py-2 rounded-full border border-border shadow-sm flex-row items-center"
              >
                <Ionicons
                  name="globe-outline"
                  size={15}
                  color="#4F46E5"
                  style={{ marginRight: isRTL ? 0 : 5, marginLeft: isRTL ? 5 : 0 }}
                />
                <Text className="text-primary font-semibold text-[14px]">
                  {locale === "en" ? "اردو" : "English"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Header Section: Dynamically compresses when keyboard opens */}
            <View className="items-center">
              {!keyboardVisible ? (
                <>
                  {/* Full Brand Graduation Cap Squircle Badge */}
                  <View className="w-[72px] h-[72px] bg-primary rounded-[22px] items-center justify-center shadow-md mt-3">
                    <Ionicons name="school" size={38} color="#FFFFFF" />
                  </View>

                  {/* Welcome Title */}
                  <Text className="text-[26px] font-bold text-main mt-4 text-center tracking-tight">
                    {t("auth.welcome")}
                  </Text>

                  {/* Subtitle Description */}
                  <Text className="text-[14px] text-muted mt-2 text-center leading-5 px-3 max-w-[320px]">
                    {t("auth.description")}
                  </Text>
                </>
              ) : (
                /* Compact Header when keyboard is active to maximize visible form area */
                <View className="flex-row items-center justify-center py-2">
                  <View className="w-8 h-8 bg-primary rounded-xl items-center justify-center mr-2 shadow-xs">
                    <Ionicons name="school" size={17} color="#FFFFFF" />
                  </View>
                  <Text className="text-[20px] font-bold text-main tracking-tight">
                    {t("auth.welcome")}
                  </Text>
                </View>
              )}
            </View>

            {/* Form Card Container */}
            <View className={`w-full max-w-[420px] self-center ${keyboardVisible ? "mt-2" : "mt-6"}`}>
              <AuthCard>
                {/* Identifier Input */}
                <CustomInput
                  label={t("auth.identifierLabel")}
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                  placeholder={t("auth.identifierPlaceholder")}
                  error={identifierError}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  isRTL={isRTL}
                  returnKeyType="next"
                  onFocus={handleIdentifierFocus}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  blurOnSubmit={false}
                  containerClassName="mb-4"
                />

                {/* Password Input */}
                <CustomInput
                  ref={passwordInputRef}
                  label={t("auth.passwordLabel")}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder={t("auth.passwordPlaceholder")}
                  error={passwordError}
                  isPassword
                  isRTL={isRTL}
                  returnKeyType="done"
                  showPasswordText={t("auth.showPassword")}
                  hidePasswordText={t("auth.hidePassword")}
                  onFocus={handlePasswordFocus}
                  onSubmitEditing={handleSignIn}
                  containerClassName="mb-5"
                />

                {/* Sign In Primary Action Button */}
                <PrimaryButton
                  title={t("auth.signIn")}
                  onPress={handleSignIn}
                  loading={loading}
                />

                {/* Bottom Office Note */}
                <Text
                  className={`text-[12px] text-muted mt-3.5 leading-4.5 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.footerNote")}
                </Text>
              </AuthCard>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
