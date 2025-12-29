import React from "react"
import { View, StyleSheet, Platform } from "react-native"
import { Text } from "../common/components/Text"
import { Button } from "../common/components/Button"
import { EstimateRow, EstimateSection, UnitOfMeasure } from "@/data"
import { useState } from "react"
import { TextField } from "../common/components/TextField"
import { CurrencyField } from "../common/components/CurrencyField"
import { QuantityField } from "../common/components/QuantityField"
import { UomPicker } from "../common/components/UomPicker"
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers"
import { getColors } from "../common/theme/tokens/alias/colors"
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme"
import type { ThemeScheme } from "../common/theme/types"

type EditFormProps = {
	mode: "item" | "section"
	data: EstimateRow | EstimateSection
	onSave: (updates: any) => void
	onClose?: () => void
	showCancel?: boolean
}

function isEstimateRow(data: any): data is EstimateRow {
	return "price" in data && "quantity" in data && "uom" in data
}

function getStyle(theme: ThemeScheme) {
	const { spacing } = numbersAliasTokens
	const colors = getColors(theme)

	return StyleSheet.create({
		container: {
			padding: spacing.sm,
		},
		editItemHeader: {
			color: colors.text.secondary,
			marginBottom: spacing.md,
		},
		field: {
			marginBottom: spacing.sm,
		},
		row: {
			flexDirection: "row",
			gap: spacing.sm,
			marginBottom: spacing.sm,
		},
		halfField: {
			flex: 1,
		},
		formActions: {
			flexDirection: "row",
			justifyContent: "flex-end",
			gap: spacing["2xs"],
			marginTop: spacing.lg,
		},
		button: {
			flex: 1,
		},
		totalRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: spacing.sm,
		},
		totalLabel: {
			color: colors.text.secondary,
		},
	})
}

export function EditForm({ mode, data, onSave, onClose, showCancel }: EditFormProps) {
	const { value: theme } = useCurrentThemeScheme()
	const styles = getStyle(theme)

	const [title, setTitle] = useState(data.title)
	const [price, setPrice] = useState(
		isEstimateRow(data) ? data.price.toString() : ""
	)
	const [quantity, setQuantity] = useState(
		isEstimateRow(data) ? data.quantity : 1
	)
	const [uom, setUom] = useState<UnitOfMeasure>(
		isEstimateRow(data) ? data.uom : "EA"
	)

	const handleIncrement = () => {
		setQuantity((prev) => prev + 1)
	}

	const handleDecrement = () => {
		setQuantity((prev) => Math.max(1, prev - 1))
	}

	const handleSave = () => {
		if (mode === "item") {
			onSave({
				...data,
				title,
				price: parseFloat(price),
				quantity,
				uom,
			})
		} else {
			onSave({ title })
		}
		onClose?.()
	}

	const total = (parseFloat(price) || 0) * quantity

	const renderWebForm = () => (
		<>
			<View style={styles.field}>
				<CurrencyField
					value={price}
					onChangeText={setPrice}
					label="Cost"
				/>
			</View>
			<View style={styles.field}>
				<UomPicker value={uom} onSelect={setUom} />
			</View>
			<View style={styles.field}>
				<TextField
					value={quantity.toString()}
					onChangeText={(text) => setQuantity(parseInt(text) || 1)}
					keyboardType="number-pad"
					label="Quantity"
				/>
			</View>
			<View style={styles.totalRow}>
				<Text style={styles.totalLabel}>Total</Text>
				<Text weight="bold">
					${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				</Text>
			</View>
		</>
	)

	const renderMobileForm = () => (
		<>
			<View style={styles.row}>
				<View style={styles.halfField}>
					<CurrencyField
						value={price}
						onChangeText={setPrice}
						label="Cost"
					/>
				</View>
				<View style={styles.halfField}>
					<UomPicker value={uom} onSelect={setUom} />
				</View>
			</View>
			<View style={styles.field}>
				<QuantityField
					value={quantity}
					onDecrement={handleDecrement}
					onIncrement={handleIncrement}
				/>
			</View>
		</>
	)

	return (
		<View style={styles.container}>
			{Platform.OS === "web" && <Text style={styles.editItemHeader}>Edit Item </Text>}
			<View style={styles.field}>
				<TextField
					value={title}
					onChangeText={setTitle}
					label={mode === "item" ? "Item title" : "Group title"}
				/>
			</View>

			{mode === "item" && (
				Platform.OS === "web" ? renderWebForm() : renderMobileForm()
			)}

			<View style={styles.formActions}>
				{showCancel && onClose && (
					<Button variant="destructive" onPress={onClose} style={styles.button}>
						Cancel
					</Button>
				)}
				<Button onPress={handleSave} style={styles.button}>
					Save
				</Button>
			</View>
		</View>
	)
}
