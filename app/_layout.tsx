import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/src/common/context/ThemeContext";
import { useFonts } from "@/src/common/theme/fonts";

export default function RootLayout() {
  const [fontsLoaded] = useFonts();

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
