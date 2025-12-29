import {
  Pressable,
  StyleSheet,
  PressableProps,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Text } from "./Text";
import { forwardRef, PropsWithChildren, useState } from "react";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import { getColors } from "../theme/tokens/alias/colors";
import { getComponentTokens } from "../theme/tokens/components";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { type ThemeScheme } from "../theme/types";

interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: "primary" | "secondary" | "destructive";
  style?: StyleProp<ViewStyle>;
}

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing } = numbersAliasTokens;
  const colors = getColors(theme);
  const componentTokens = getComponentTokens(theme);

  return StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: componentTokens.button.borderRadius,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      color: colors.text.white,
    },
    destructiveText: {
      color: colors.text.danger,
    },
  });
}

export const Button = forwardRef<View, PropsWithChildren<ButtonProps>>(
  function Button(
    { variant = "primary", style, disabled, children, ...props },
    ref
  ) {
    const [hovered, setHovered] = useState(false);
    const { value: theme } = useCurrentThemeScheme();

    const componentTokens = getComponentTokens(theme);
    const styles = getStyleForTheme(theme);

    function getBackground(pressed: boolean) {
      if (variant === "destructive") return "transparent";
      const bgSet = componentTokens.button.background[variant];
      if (pressed) return bgSet.pressed;
      if (hovered) return bgSet.hover;
      return bgSet.idle;
    }

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: getBackground(pressed) },
          disabled && styles.disabled,
          style,
        ]}
        disabled={disabled}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        {...props}
      >
        <Text 
          weight="bold" 
          size="sm" 
          style={variant === "destructive" ? styles.destructiveText : styles.text}
        >
          {children}
        </Text>
      </Pressable>
    );
  }
);
