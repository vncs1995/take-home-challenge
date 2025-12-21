import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Text } from "../common/components/Text";
import { BottomSheet, BottomSheetRef } from "../common/components/BottomSheet";
import { useRef } from "react";
import {
  calculateSectionTotal,
  calculateEstimateTotal,
} from "../common/lib/estimate";
import type { EstimateRow, EstimateSection } from "@/data";
import { EditForm } from "./EditForm";
import { useEstimateScreen } from "./useEstimateScreen";
import { TextField } from "../common/components/TextField";
import { ThemeSwitcher } from "../common/components/ThemeSwitcher";
import { Button } from "../common/components/Button";
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers";
import { getColors } from "../common/theme/tokens/alias/colors";
import { type ThemeScheme } from "../common/theme/types";
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme";

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.layer.solid.medium,
    },
    headerButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    titleInput: {
      fontSize: 24,
      fontWeight: "bold",
      padding: spacing.sm,
      backgroundColor: colors.layer.solid.light,
      color: colors.text.primary,
    },
    section: {
      marginBottom: spacing.sm,
      backgroundColor: colors.layer.solid.light,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: spacing.sm,
      backgroundColor: colors.layer.solid.medium,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline.light,
    },
    sectionHeaderText: {
      color: colors.text.primary,
    },
    row: {
      flexDirection: "row",
      padding: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline.light,
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowLeftContent: {
      flex: 1,
      marginRight: spacing.sm,
    },
    rowTitle: {
      fontSize: 16,
      marginBottom: spacing["3xs"],
      fontWeight: "500",
      color: colors.text.primary,
    },
    rowPriceDetails: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    rowTotal: {
      color: colors.text.primary,
    },
    estimateTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: spacing.sm,
      backgroundColor: colors.layer.solid.light,
      borderTopWidth: 1,
      borderTopColor: colors.outline.light,
      marginTop: spacing["2xs"],
    },
    estimateTotalText: {
      color: colors.text.primary,
      fontWeight: "600",
    },
  });
}

export default function EstimateScreen() {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { value: theme } = useCurrentThemeScheme();
  const styles = getStyleForTheme(theme);
  const colors = getColors(theme);

  const {
    estimate,
    updateTitle,
    editMode,
    handleStartItemEdit,
    handleStartSectionEdit,
    handleSaveItem,
    handleSaveSection,
    handleStopEdit,
  } = useEstimateScreen();

  const handleSectionPress = (section: EstimateSection) => {
    handleStartSectionEdit(section);
    bottomSheetRef.current?.present();
  };

  const handleItemPress = (item: EstimateRow) => {
    handleStartItemEdit(item);
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
    handleStopEdit();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.layer.solid.medium}
      />
      <ScrollView>
        <View style={styles.headerButtons}>
          <ThemeSwitcher />
          <Button variant="secondary" style={{ maxWidth: 118 }}>
            + Add
          </Button>
        </View>
        <TextField
          style={styles.titleInput}
          value={estimate.title}
          onChangeText={updateTitle}
          placeholder="Enter estimate title"
          placeholderTextColor={colors.text.tertiary}
        />
        {estimate.sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Pressable
              onPress={() => handleSectionPress(section)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
              <Text style={styles.sectionHeaderText}>${calculateSectionTotal(section).toFixed(2)}</Text>
            </Pressable>
            {section.rows.map((row) => (
              <Pressable
                key={row.id}
                style={styles.row}
                onPress={() => handleItemPress(row)}
              >
                <View style={styles.rowLeftContent}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowPriceDetails}>
                    ${row.price.toFixed(2)} × {row.quantity} {row.uom}
                  </Text>
                </View>
                <Text style={styles.rowTotal}>${(row.price * row.quantity).toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={styles.estimateTotal}>
          <Text style={styles.estimateTotalText}>Total:</Text>
          <Text style={styles.estimateTotalText}>${calculateEstimateTotal(estimate).toFixed(2)}</Text>
        </View>
      </ScrollView>

      <BottomSheet ref={bottomSheetRef} title={`Edit ${editMode?.type === "item" ? "Item" : "Section"}`}>
        {editMode && (
          <EditForm
            key={editMode.data.id}
            mode={editMode.type}
            data={editMode.data}
            onSave={
              editMode.type === "item" ? handleSaveItem : handleSaveSection
            }
            onClose={handleCloseBottomSheet}
          />
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}
