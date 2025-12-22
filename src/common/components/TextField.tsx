import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  Platform,
} from "react-native";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";

export type TextFieldProps = TextInputProps & {
  label?: string;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  const HEIGHT = 56;

  return StyleSheet.create({
    wrapper: {
      width: "100%",
      height: HEIGHT,
      justifyContent: "center",
    },

    label: {
      position: "absolute",
      left: spacing.sm,
      zIndex: 2,
      // little "chip" behind label like in iOS floating label fields
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      // helps the chip look clean
      borderRadius: 999,
      // don't block taps on the input
      pointerEvents: "none",
    },

    input: {
      width: "100%",
      height: HEIGHT,
      minHeight: HEIGHT,

      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.outline.medium,

      backgroundColor: colors.layer.solid.light,
      color: colors.text.primary,

      paddingHorizontal: spacing.sm,

      // this combo matches the screenshot better than just paddingTop
      paddingTop: spacing.md,     // room for label when floated
      paddingBottom: spacing.sm,  // keeps text vertically centered

      fontSize: 16,

      // iOS: keep text baseline nice; Android: no-op
      ...(Platform.OS === "android" ? { textAlignVertical: "center" as const } : {}),
    },

    inputFocused: {
      borderColor: colors.outline.dark ?? colors.text.secondary, // fallback if you don't have outline.dark
    },
  });
}

function getLabelColors(theme: ThemeScheme) {
  const colors = getColors(theme);
  return {
    inactive: colors.text.tertiary,
    active: colors.text.secondary,
  };
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, value, defaultValue, onFocus, onBlur, style, ...props },
  ref
) {
  const { value: theme } = useCurrentThemeScheme();
  const styles = getStyleForTheme(theme);
  const labelColors = getLabelColors(theme);
  const colors = getColors(theme);

  const [isFocused, setIsFocused] = useState(false);

  const hasValue =
    value !== undefined
      ? value.length > 0
      : defaultValue !== undefined && defaultValue.length > 0;

  const animatedLabel = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue, animatedLabel]);

  // Tweaked positions to match screenshot: label sits inside when empty,
  // floats just above the input border when focused/filled.
  const labelStyle = {
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [labelColors.inactive, labelColors.active],
    }),
  };

  return (
    <View style={styles.wrapper}>
      {label && <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>}

      <TextInput
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          style,
        ]}
        placeholderTextColor={colors.text.tertiary}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
});
