import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Text } from "../common/components/Text";
import type { EstimateRow, EstimateSection } from "@/data";
import {
  calculateSectionTotal,
  calculateEstimateTotal,
} from "../common/lib/estimate";
import { EditForm } from "./EditForm";
import { AddForm } from "./AddForm";
import { useEstimateScreen } from "./useEstimateScreen";
import { TextField } from "../common/components/TextField";
import { ThemeSwitcher } from "../common/components/ThemeSwitcher";
import { AddButton } from "../common/components/AddButton";
import { Badge } from "../common/components/Badge";
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers";
import { getColors } from "../common/theme/tokens/alias/colors";
import { customFonts } from "../common/theme/fonts";
import { type ThemeScheme } from "../common/theme/types";
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.layer.solid.light,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      backgroundColor: colors.layer.solid.light,
      gap: spacing.sm,
    },
    content: {
      flex: 1,
      flexDirection: "row",
    },
    tableContainer: {
      flex: 1,
      padding: spacing["3xl"],
    },
    formContainer: {
      flex: 0.5,
      height: "auto",
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: 8,
      backgroundColor: colors.layer.solid.light,
      padding: spacing.md,
      marginRight: spacing["3xl"],
    },
    titleInput: {
      ...customFonts.bold.headline.sm,
      backgroundColor: colors.layer.solid.light,
      color: colors.text.primary,
      borderWidth: 0,
      marginBottom: spacing.lg,
    },
    sectionsContainer: {
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: 8,
    },
    section: {
      backgroundColor: colors.layer.solid.light,
      borderRadius: 8,
      overflow: "hidden",
    },
    selectedSection: {
      backgroundColor: colors.layer.solid.medium,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.sm,
      backgroundColor: colors.layer.solid.medium,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline.light,
    },
    sectionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    sectionHeaderText: {
      color: colors.text.primary,
    },
    sectionHeaderRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing["3xs"],
    },
    tableRow: {
      flexDirection: "row",
      padding: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline.light,
      cursor: "pointer",
      justifyContent: "space-between",
      alignItems: "center",
    },
    selectedRow: {
      backgroundColor: colors.layer.solid.medium,
    },
    rowLeftContent: {
      flex: 1,
      marginRight: spacing.md,
    },
    rowTitle: {
      marginBottom: spacing["3xs"],
      color: colors.text.primary,
    },
    rowPriceDetails: {
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
      borderRadius: 8,
      marginTop: spacing.xs,
    },
    estimateTotalText: {
      color: colors.text.primary,
    },
  });
}

export default function EstimateScreenDesktop() {
  const { value: theme } = useCurrentThemeScheme();
  const styles = getStyleForTheme(theme);
  const colors = getColors(theme);

  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);

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
  };

  const handleItemPress = (item: EstimateRow) => {
    handleStartItemEdit(item);
  };

  const handleAddPress = (sectionId?: string) => {
    handleStopEdit();
    setTargetSectionId(sectionId || null);
  };

  const handleSaveNew = (data: {
    type: "item" | "section";
    title: string;
    price?: number;
    quantity?: number;
    uom?: any;
  }) => {
    if (data.type === "section") {
      handleAddSection({ title: data.title });
    } else if (targetSectionId) {
      handleAddItem(targetSectionId, {
        title: data.title,
        price: data.price || 0,
        quantity: data.quantity || 1,
        uom: data.uom || "EA",
      });
    }
    setTargetSectionId(null);
  };

  const renderForm = () => {
    if (editMode) {
      return (
        <EditForm
          key={editMode.data.id}
          mode={editMode.type}
          data={editMode.data}
          onSave={editMode.type === "item" ? handleSaveItem : handleSaveSection}
          onClose={handleStopEdit}
          showCancel
        />
      );
    }

    // No mode prop = show the mode switcher
    return <AddForm onSave={handleSaveNew} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Badge type="Draft" />
        <ThemeSwitcher />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Left side - Table */}
        <ScrollView
          style={styles.tableContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <TextField
            style={styles.titleInput}
            value={estimate.title}
            onChangeText={updateTitle}
            placeholder="Enter estimate title"
            placeholderTextColor={colors.text.tertiary}
          />
          <View style={styles.sectionsContainer}>
            {estimate.sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <Pressable
                  style={[
                    styles.sectionHeader,
                    editMode?.type === "section" &&
                      editMode.data.id === section.id &&
                      styles.selectedSection,
                  ]}
                  onPress={() => handleSectionPress(section)}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <Text style={styles.sectionHeaderText}>
                      {section.title}
                    </Text>
                    <AddButton onPress={() => handleAddPress(section.id)} />
                  </View>
                  <View style={styles.sectionHeaderRight}>
                    <Text style={styles.sectionHeaderText}>
                      ${calculateSectionTotal(section).toFixed(2)}
                    </Text>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color={colors.icon.primary}
                    />
                  </View>
                </Pressable>
                {/* Table rows */}
                {section.rows.map((row) => (
                  <Pressable
                    key={row.id}
                    style={[
                      styles.tableRow,
                      editMode?.type === "item" &&
                        editMode.data.id === row.id &&
                        styles.selectedRow,
                    ]}
                    onPress={() => handleItemPress(row)}
                  >
                    <View style={styles.rowLeftContent}>
                      <Text size="md" style={styles.rowTitle}>
                        {row.title}
                      </Text>
                      <Text size="sm" style={styles.rowPriceDetails}>
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
              <Text style={styles.estimateTotalText} weight="bold">
                Total:
              </Text>
              <Text style={styles.estimateTotalText} weight="bold">
                ${calculateEstimateTotal(estimate).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Right side - Form */}
        <View style={styles.formContainer}>{renderForm()}</View>
      </View>
    </View>
  );
}
