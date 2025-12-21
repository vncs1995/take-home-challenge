import React, { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react"
import { useColorScheme } from "react-native"
import { ThemeScheme } from "../theme/types"

const DEFAULT_THEME_SCHEME: ThemeScheme = "light"

interface ThemeContextValue {
	value: ThemeScheme
	setValue: (value: ThemeScheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
	preferSystem?: boolean
}

export function ThemeProvider({ children, preferSystem }: PropsWithChildren<ThemeProviderProps>) {
	const deviceThemeScheme = useColorScheme()
	const [themeScheme, setThemeScheme] = useState<ThemeScheme>(DEFAULT_THEME_SCHEME)

	const contextValue = useMemo(() => {
		const systemThemeScheme = deviceThemeScheme ?? DEFAULT_THEME_SCHEME
		const value = preferSystem === true ? systemThemeScheme : themeScheme

		return {
			value,
			setValue: setThemeScheme,
		}
	}, [deviceThemeScheme, preferSystem, themeScheme])

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useThemeContext(): ThemeContextValue {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error("useThemeContext must be used within a ThemeProvider")
	}
	return context
}
