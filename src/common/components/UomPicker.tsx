import React, {
  useState,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { Text } from "./Text";
import { TextField } from "./TextField";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { UnitOfMeasure, UOM_LABELS } from "@/data";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TOP_OFFSET = 32;

const UOM_OPTIONS = Object.keys(UOM_LABELS) as UnitOfMeasure[];

export type UomPickerRef = {
  present: () => void;
  dismiss: () => void;
};

type UomPickerProps = {
  value: UnitOfMeasure;
  onSelect: (uom: UnitOfMeasure) => void;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      padding: spacing.sm,
      height: SCREEN_HEIGHT - TOP_OFFSET - 80, // 80 accounts for bottom sheet header/handle
    },
    searchContainer: {
      marginBottom: spacing.sm,
    },
    listContent: {
      paddingBottom: spacing.sm,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
    },
    optionCode: {
      color: colors.text.primary,
    },
    optionLabel: {
      color: colors.text.secondary,
    },
  });
}

function getTriggerStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      position: "absolute",
      top: -8,
      left: spacing.sm,
      zIndex: 2,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      borderRadius: 999,
      color: colors.text.secondary,
    },
    trigger: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.md,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing.sm,
    },
    triggerText: {
      color: colors.text.primary,
    },
    triggerIcon: {
      color: colors.text.secondary,
    },
  });
}

export const UomPicker = ({ value, onSelect }: UomPickerProps) => {
    const { value: theme } = useCurrentThemeScheme();
    const styles = getStyleForTheme(theme);
    const triggerStyles = getTriggerStyleForTheme(theme);
    const colors = getColors(theme);

    const [search, setSearch] = useState("");
    const bottomSheetRef = React.useRef<BottomSheetRef>(null);

    const filteredOptions = useMemo(() => {
      if (!search.trim()) return UOM_OPTIONS;
      const searchLower = search.toLowerCase();
      return UOM_OPTIONS.filter(
        (option) =>
          option.toLowerCase().includes(searchLower) ||
          UOM_LABELS[option].toLowerCase().includes(searchLower)
      );
    }, [search]);

    const handleSelect = (uom: UnitOfMeasure) => {
      onSelect(uom);
      bottomSheetRef.current?.dismiss();
      setSearch("");
    };

    const handleDismiss = () => {
      setSearch("");
    };

    const handleTriggerPress = () => {
      bottomSheetRef.current?.present();
    };

    const renderOption = ({ item }: { item: UnitOfMeasure }) => {
      return (
        <Pressable onPress={() => handleSelect(item)} style={styles.option}>
          <Text size="md" style={styles.optionCode}>
            {UOM_LABELS[item]}
          </Text>
          <Text size="sm" style={styles.optionLabel}>
            {item}
          </Text>
        </Pressable>
      );
    };

    return (
      <>
        <View style={triggerStyles.wrapper}>
          <Text size="xs" style={triggerStyles.label}>
            Unit of Measure
          </Text>
          <Pressable style={triggerStyles.trigger} onPress={handleTriggerPress}>
            <Text size="md" style={triggerStyles.triggerText}>
              {value}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          title="Select Unit of Measure"
          onDismissed={handleDismiss}
        >
          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <TextField
                value={search}
                onChangeText={setSearch}
                label="Search units..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </BottomSheet>
      </>
    );
  };
