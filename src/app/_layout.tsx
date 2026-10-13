import { ActionPortalProvider } from "@/components/navigation/ActionPortal";
import { Copy,Screen,SecondaryButton,Skeleton } from "@/components/ui";
import { colors } from "@/constants/theme";
import { AppProvider,useApp } from "@/hooks/useApp";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
function Routes() {
  const { loading, error, retry } = useApp();
  if (loading)
    return (
      <Screen>
        <Skeleton />
        <Skeleton />
        <Copy>Loading your training…</Copy>
      </Screen>
    );
  return (
    <>
      {error && (
        <View style={{ backgroundColor: colors.surfaceElevated, padding: 16 }}>
          <Copy>{error}</Copy>
          <SecondaryButton title="Retry saving" onPress={retry} />
        </View>
      )}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgPrimary },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bgPrimary },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="swimmer" options={{ headerShown: false }} />
        <Stack.Screen name="coach" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
export default function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <ActionPortalProvider>
            <Routes />
          </ActionPortalProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
