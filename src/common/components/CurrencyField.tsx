import React, { forwardRef, useMemo, useState } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  Text,
  Platform,
} from "react-native";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import { customFonts } from "../theme/fonts";

export type CurrencyFieldProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  label?: string;
  currencySymbol?: string;
  value: string;
  onChangeText: (value: string) => void;
};

// Format string to currency display (e.g., "12345" -> "123.45")
function formatCurrency(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "0.00";
  
  const cents = parseInt(digits, 10);
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  
  const dollarsFormatted = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${dollarsFormatted}.${remainder.toString().padStart(2, "0")}`;
}

// Parse display value back to decimal string (e.g., "123.45" -> "123.45")
function parseToDecimal(formatted: string): string {
  const digits = formatted.replace(/[^\d]/g, "");
  if (!digits) return "0";
  
  const cents = parseInt(digits, 10);
  return (cents / 100).toString();
}

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  const HEIGHT = 56;
  const inputFont = customFonts.regular.text.md;

  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      position: "absolute",
      left: spacing.sm,
      top: -8,
      zIndex: 2,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      borderRadius: 999,
      color: colors.text.secondary,
      fontSize: 12,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: HEIGHT,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.outline.medium,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing.sm,
    },
    containerFocused: {
      borderColor: colors.outline.dark,
    },
    currencySymbol: {
      color: colors.text.tertiary,
      fontFamily: inputFont.fontFamily,
      fontWeight: inputFont.fontWeight,
      fontSize: inputFont.fontSize,
      lineHeight: 24,
      marginRight: spacing["3xs"],
    },
    input: {
      flex: 1,
      height: HEIGHT,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      color: colors.text.primary,
      backgroundColor: "transparent",
      fontFamily: inputFont.fontFamily,
      fontWeight: inputFont.fontWeight,
      fontSize: inputFont.fontSize,
      ...(Platform.OS === "android"
        ? { textAlignVertical: "center" as const }
        : {}),
    },
  });
}

export const CurrencyField = forwardRef<TextInput, CurrencyFieldProps>(
  function CurrencyField(
    {
      label = "Cost",
      currencySymbol = "$",
      value,
      onChangeText,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) {
    const { value: theme } = useCurrentThemeScheme();
    const styles = useMemo(() => getStyleForTheme(theme), [theme]);
    const [isFocused, setIsFocused] = useState(false);

    // Convert decimal string to display format
    const displayValue = useMemo(() => {
      if (!value) return "0.00";
      const cents = Math.round(parseFloat(value) * 100);
      return formatCurrency(cents.toString());
    }, [value]);

    const handleChangeText = (text: string) => {
      const decimal = parseToDecimal(text);
      onChangeText(decimal);
    };

    return (
      <View style={styles.wrapper}>
        {!!label && <Text style={styles.label}>{label}</Text>}

        <View style={[styles.container, isFocused && styles.containerFocused]}>
          <Text style={styles.currencySymbol}>{currencySymbol}</Text>
          <TextInput
            ref={ref}
            value={displayValue}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            selection={{ start: displayValue.length, end: displayValue.length }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
            style={styles.input}
          />
        </View>
      </View>
    );
  }
);
