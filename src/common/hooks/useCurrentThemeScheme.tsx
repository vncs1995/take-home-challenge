import { useThemeContext } from "../context/ThemeContext"

interface UseCurrentThemeSchemePayload {
	value: ThemeScheme
	setValue: (value: ThemeScheme) => void
}

import { ThemeScheme } from "../theme/types"
export type { ThemeScheme }

export function useCurrentThemeScheme(): UseCurrentThemeSchemePayload {
	return useThemeContext()
}
