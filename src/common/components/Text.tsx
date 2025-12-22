import { Text as RNText, TextProps as RNTextProps } from "react-native"
import { forwardRef, PropsWithChildren } from "react"
import {
	customFonts,
	type FontWeight,
	type FontSpec,
	type FontSize,
} from "../theme/fonts"

interface TextProps extends RNTextProps {
	weight?: FontWeight
	spec?: FontSpec
	size?: FontSize
}

export const Text = forwardRef<RNText, PropsWithChildren<TextProps>>(
	function Text(
		{ weight = "regular", spec = "text", size = "md", style, ...props },
		ref
	) {
		const fontVariant = customFonts[weight]
		const fontSpec = fontVariant[spec]
		const fontStyle = fontSpec[size as keyof typeof fontSpec]

		return <RNText ref={ref} style={[fontStyle, style]} {...props} />
	}
)
