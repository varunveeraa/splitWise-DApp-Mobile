import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { WagmiProvider, useAccount, useConnect } from 'wagmi';
import { sepolia } from '@wagmi/core/chains';
import { createWeb3Modal, defaultWagmiConfig, Web3Modal, useWeb3Modal, W3mButton } from '@web3modal/wagmi-react-native';

const queryClient = new QueryClient();

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const projectId = 'af21521794137bf96ff2ad602ac95493';

const metadata = {
  name: 'SplitWise',
  description: 'SplitWise App Prototype 2',
  url: ' exp://118.139.29.177:8081',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'yourapp://',
    universal: 'https://your-universal-link.com',
  },
};

const chains = [sepolia] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  projectId,
  wagmiConfig,
  defaultChain: sepolia,
  enableAnalytics: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="SignIn/index"/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="CreateSplit/index"/>
            <Stack.Screen name="CreatSplitsPage/index"/>
            <Stack.Screen name="SplitMethods/index" />
            <Stack.Screen name="JoinNewSplit/index"/>
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
