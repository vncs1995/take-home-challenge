import { Pressable, StyleSheet, PressableProps, View } from "react-native";
import { Text } from "./Text";
import { forwardRef, PropsWithChildren, useState } from "react";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import { getColors } from "../theme/tokens/alias/colors";
import { getComponentTokens } from "../theme/tokens/components";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<View, PropsWithChildren<ButtonProps>>(
  function Button(
    { variant = "primary", style, disabled, children, ...props },
    ref
  ) {
    const [hovered, setHovered] = useState(false);
    const { value: theme } = useCurrentThemeScheme();

    const colors = getColors(theme);
    const componentTokens = getComponentTokens(theme);

    return (
      <Pressable
        ref={ref}
        style={[
          {
            backgroundColor: componentTokens.button.background[variant].idle,
            borderRadius: componentTokens.button.borderRadius,
          },
          styles.button,
          disabled && styles.disabled,
          hovered && styles.hovered,
          style,
        ]}
        disabled={disabled}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        {...props}
      >
        <Text style={styles.text}>{children}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: {flex: 1, justifyContent: "center", alignItems: "center", padding: 12},
  disabled: {},
  text: {},
  hovered: {},
});
