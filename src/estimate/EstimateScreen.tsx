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
import { useRef, useState } from "react";
import {
  calculateSectionTotal,
  calculateEstimateTotal,
} from "../common/lib/estimate";
import type { EstimateRow, EstimateSection } from "@/data";
import { EditForm } from "./EditForm";
import { AddForm } from "./AddForm";
import { useEstimateScreen } from "./useEstimateScreen";
import { TextField } from "../common/components/TextField";
import { ThemeSwitcher } from "../common/components/ThemeSwitcher";
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers";
import { getColors } from "../common/theme/tokens/alias/colors";
import { type ThemeScheme } from "../common/theme/types";
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme";
import { AddButton } from "../common/components/AddButton";
import { Badge } from "../common/components/Badge";

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.layer.solid.medium,
    },
    headerButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    badge: {
       marginLeft: spacing.md ,
       marginTop: spacing.lg,
       marginBottom: spacing["2xs"],
    },
    titleInput: {
      fontSize: 24,
      fontWeight: "bold",
      backgroundColor: colors.layer.solid.medium,
      color: colors.text.primary,
      borderWidth: 0,
    },
    section: {
      borderTopWidth: 1,
      borderTopColor: colors.outline.light,
      marginBottom: spacing.sm,
      backgroundColor: colors.layer.solid.medium,
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
      borderBottomColor: colors.layer.solid.medium,
      backgroundColor: colors.layer.solid.light,
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
  const [bottomSheetMode, setBottomSheetMode] = useState<
    "edit" | "add-section" | "add-item" | null
  >(null);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
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
    handleAddSection,
    handleAddItem,
    handleStopEdit,
  } = useEstimateScreen();

  const handleSectionPress = (section: EstimateSection) => {
    handleStartSectionEdit(section);
    setBottomSheetMode("edit");
    bottomSheetRef.current?.present();
  };

  const handleItemPress = (item: EstimateRow) => {
    handleStartItemEdit(item);
    setBottomSheetMode("edit");
    bottomSheetRef.current?.present();
  };

  const handleAddSectionPress = () => {
    setBottomSheetMode("add-section");
    setTargetSectionId(null);
    bottomSheetRef.current?.present();
  };

  const handleAddItemPress = (sectionId: string) => {
    setBottomSheetMode("add-item");
    setTargetSectionId(sectionId);
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
    setBottomSheetMode(null);
    setTargetSectionId(null);
    handleStopEdit();
  };

  const handleSaveNewSection = (data: { title: string }) => {
    handleAddSection(data);
    handleCloseBottomSheet();
  };

  const handleSaveNewItem = (data: {
    title: string;
    price: number;
    quantity: number;
    uom: any;
  }) => {
    if (targetSectionId) {
      handleAddItem(targetSectionId, data);
    }
    handleCloseBottomSheet();
  };

  const getBottomSheetTitle = () => {
    if (bottomSheetMode === "add-section") return "Add Group";
    if (bottomSheetMode === "add-item") return "Add Item";
    if (editMode?.type === "item") return "Edit Item";
    return "Edit Group";
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
          <AddButton text="Add" onPress={handleAddSectionPress} />
        </View>
        <Badge
          type="Draft"
          style={styles.badge}
        />
        <TextField
          style={styles.titleInput}
          value={estimate.title}
          multiline
          numberOfLines={2}
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
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <AddButton onPress={() => handleAddItemPress(section.id)} />
              </View>
              <Text style={styles.sectionHeaderText}>
                ${calculateSectionTotal(section).toFixed(2)}
              </Text>
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
                <Text style={styles.rowTotal}>
                  ${(row.price * row.quantity).toFixed(2)}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={styles.estimateTotal}>
          <Text style={styles.estimateTotalText}>Total:</Text>
          <Text style={styles.estimateTotalText}>
            ${calculateEstimateTotal(estimate).toFixed(2)}
          </Text>
        </View>
      </ScrollView>

      <BottomSheet ref={bottomSheetRef} title={getBottomSheetTitle()}>
        {bottomSheetMode === "edit" && editMode && (
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
        {(bottomSheetMode === "add-section" ||
          bottomSheetMode === "add-item") && (
          <AddForm
            mode={bottomSheetMode}
            onSave={
              bottomSheetMode === "add-section"
                ? handleSaveNewSection
                : handleSaveNewItem
            }
          />
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}
