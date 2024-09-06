import React, { useState, useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { WagmiProvider, useAccount, useConnect } from 'wagmi';
import { mainnet, polygon, arbitrum, sepolia } from '@wagmi/core/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal, defaultWagmiConfig, Web3Modal, useWeb3Modal } from '@web3modal/wagmi-react-native';
import { Text, View, Button } from 'react-native';
import { Redirect } from 'expo-router';
import { updateToken } from '@/utilis/variables';

const queryClient = new QueryClient();

const projectId = 'af21521794137bf96ff2ad602ac95493';

const metadata = {
  name: 'Your App',
  description: 'Your App Description',
  url: 'https://your-app.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'yourapp://',
    universal: 'https://your-universal-link.com',
  },
};

const chains = [sepolia, mainnet, polygon, arbitrum] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  projectId,
  wagmiConfig,
  defaultChain: sepolia,
  enableAnalytics: true,
});

const connectWallet = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3Modal />
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const ConnectWallet = () => {
  const { open } = useWeb3Modal(); 
  const { address, isConnected, isConnecting, isReconnecting, status } = useAccount(); 
  const [redirect, setRedirect] = useState(false);
  
  const handleWalletConnect = async () => {
    try {
      open();
      setRedirect(isConnected);
      updateToken(isConnected);
    } catch (error) {
      console.log('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      console.log("Wallet connected:", address); 
      setRedirect(isConnected);
    }
  }, [isConnected, address]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      {isConnecting ? (
        <Text style={{ color: 'white', fontSize: 16 }}>Connecting...</Text>
      ) : isReconnecting ? (
        <Text style={{ color: 'white', fontSize: 16 }}>Reconnecting...</Text>
      ) : (
        <Button title="Connect Wallet" onPress={handleWalletConnect} />
      )}
      {redirect && <Redirect href="/Expense" />}
    </View>
  );
};

export default connectWallet;
