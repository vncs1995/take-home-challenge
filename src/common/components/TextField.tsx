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
import { customFonts } from '../theme/fonts';

export type TextFieldProps = TextInputProps & {
  label?: string;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);
  const inputFont = customFonts.regular.text.md;

  const HEIGHT = 56;

  return StyleSheet.create({
    wrapper: {
      width: "100%",
      height: HEIGHT,
      justifyContent: "center",
    },
    multiline: {
      height: "auto",
      minHeight: 56,
    },
    label: {
      position: "absolute",
      left: spacing.sm,
      zIndex: 2,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      borderRadius: borderRadius.md,
      // don't block taps on the input
      pointerEvents: "none",
      ...customFonts.regular.text.xxs
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

      paddingTop: spacing.md, // room for label when floated
      paddingBottom: spacing.sm, // keeps text vertically centered

      // Inter 500 Medium, typography size 4
      fontFamily: inputFont.fontFamily,
      fontWeight: inputFont.fontWeight,
      fontSize: inputFont.fontSize,

      // iOS: keep text baseline nice; Android: no-op
      ...(Platform.OS === "android"
        ? { textAlignVertical: "center" as const }
        : {}),
    },

    inputFocused: {
      borderColor: colors.outline.dark,
    },
  });
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  function TextField(
    { label, value, defaultValue, onFocus, onBlur, style, multiline, ...props },
    ref
  ) {
    const { value: theme } = useCurrentThemeScheme();
    const styles = getStyleForTheme(theme);
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
        outputRange: [colors.text.tertiary, colors.text.secondary],
      }),
    };

    return (
      <View style={[styles.wrapper, multiline && styles.multiline]}>
        {label && (
          <Animated.Text style={[styles.label, labelStyle]}>
            {label}
          </Animated.Text>
        )}

        <TextInput
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          multiline={multiline}
          style={[
            styles.input,
            multiline && styles.multiline,
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
  }
);
