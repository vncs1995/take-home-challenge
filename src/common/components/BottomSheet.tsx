import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  type ModalProps,
  type NativeSyntheticEvent,
} from "react-native";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { getColorWithAlpha } from "../lib/colors";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
  isPresented: () => boolean;
};

export type BottomSheetProps = Omit<ModalProps, "visible" | "transparent"> & {
  title?: string;
  closeOnBackdropPress?: boolean;
  onDismissed?: () => void;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius, sizing } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: getColorWithAlpha(colors.core.flat.black, 55),
    },
    sheet: {
      backgroundColor: colors.layer.solid.light,
      borderTopLeftRadius: borderRadius["2xl"],
      borderTopRightRadius: borderRadius["2xl"],
      paddingBottom: spacing.sm,
      ...Platform.select({
        ios: {
          shadowColor: colors.core.flat.black,
          shadowOpacity: 0.25,
          shadowRadius: spacing.lg,
          shadowOffset: { width: 0, height: -spacing["2xs"] },
        },
        android: { elevation: 18 },
        default: {},
      }),
    },
    handle: {
      alignSelf: "center",
      width: spacing["2xl"],
      height: spacing["3xs"],
      borderRadius: borderRadius.pill,
      marginTop: spacing["2xs"],
      marginBottom: spacing["2xs"],
      backgroundColor: colors.outline.dark,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.xs,
    },
    closeButton: {
      width: spacing["2xl"],
      height: spacing["2xl"],
      borderRadius: borderRadius.pill,
      backgroundColor: colors.layer.alpha.lightNeutral,
      alignItems: "center",
      justifyContent: "center",
    },
    closeIcon: {
      fontSize: sizing.icon.lg,
      lineHeight: sizing.icon.lg,
      marginTop: -spacing["3xs"] / 2,
    },
    title: {
      flex: 1,
      textAlign: "center",
      color: colors.text.primary,
      fontSize: 18,
      fontWeight: "600",
      paddingHorizontal: spacing.xs,
    },
    content: {
      paddingHorizontal: spacing.sm,
      gap: spacing.xs,
    },
  });
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  function BottomSheet(
    {
      title,
      children,
      closeOnBackdropPress = true,
      onDismissed,
      onRequestClose,
      animationType = "slide",
      ...modalProps
    },
    ref
  ) {
    const [isVisible, setIsVisible] = useState(false);
    const { value: theme } = useCurrentThemeScheme();
	const { sizing } = numbersAliasTokens;
	const colors = getColors(theme);
    const styles = getStyleForTheme(theme);
    const dismiss = () => {
      setIsVisible(false);
      onDismissed?.();
    };

    useImperativeHandle(ref, () => ({
      present: () => setIsVisible(true),
      dismiss,
      isPresented: () => isVisible,
    }));

    const handleRequestClose = (event: NativeSyntheticEvent<any>) => {
      dismiss();
      onRequestClose?.(event);
    };

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType={animationType}
        onRequestClose={handleRequestClose}
        statusBarTranslucent
        {...modalProps}
      >
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={styles.backdrop}
            onPress={closeOnBackdropPress ? dismiss : undefined}
          />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Pressable
                onPress={dismiss}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.closeButton}
              >
                <Ionicons name="close" size={sizing.icon.lg} color={colors.icon.primary} />
              </Pressable>

              {!!title && (
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
              )}
            </View>
            <View style={styles.content}>{children}</View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);
