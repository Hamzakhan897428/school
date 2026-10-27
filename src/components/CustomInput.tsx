import React, { useState, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from "react-native";

export interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isPassword?: boolean;
  isRTL?: boolean;
  showPasswordText?: string;
  hidePasswordText?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  containerClassName?: string;
  error?: string;
  onFocus?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}

export const CustomInput = forwardRef<
  React.ElementRef<typeof TextInput>,
  CustomInputProps
>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      isPassword = false,
      isRTL = false,
      showPasswordText = "Show",
      hidePasswordText = "Hide",
      keyboardType = "default",
      autoCapitalize = "none",
      containerClassName = "",
      error,
      onFocus,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
    },
    ref
  ) => {
    const [isSecure, setIsSecure] = useState<boolean>(isPassword);

    const toggleSecureEntry = () => {
      setIsSecure((prev) => !prev);
    };

    return (
      <View className={`w-full ${containerClassName}`}>
        {/* Label */}
        <Text
          className={`text-[15px] font-semibold text-main mb-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {label}
        </Text>

        {/* Input Container */}
        <View
          className={`w-full h-13 px-4 bg-input rounded-2xl items-center border ${
            error
              ? "border-red-500 bg-red-50/20"
              : "border-transparent"
          } ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isPassword ? isSecure : false}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            textAlign={isRTL ? "right" : "left"}
            className="flex-1 py-3 text-[15px] text-main font-medium"
          />

          {isPassword && (
            <TouchableOpacity
              onPress={toggleSecureEntry}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className={isRTL ? "mr-2" : "ml-2"}
            >
              <Text className="text-[14px] font-medium text-primary">
                {isSecure ? showPasswordText : hidePasswordText}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Red Inline Error Text */}
        {error ? (
          <Text
            className={`text-[12.5px] font-medium text-red-600 mt-1.5 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
