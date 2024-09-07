import React, { useEffect, useState } from 'react';
import '@walletconnect/react-native-compat';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { mainnet, polygon, arbitrum } from '@wagmi/core/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native';
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

const chains = [mainnet, polygon, arbitrum] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

const Profile = () => {
  const { address, isConnected } = useAccount(); 
  const [redirect, setRedirect] = useState(false);
  const { disconnect } = useDisconnect();

  const handleWalletDisconnect = async () => {
    await disconnect(); 
    setRedirect(true)
  };

  useEffect(() => {
    if (!isConnected) {
      console.log("Wallet Not Connected");
      setRedirect(true);
    }
  }, [isConnected]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      {isConnected ? (
        <>
          <Text style={{ color: 'white', fontSize: 16 }}>Your Public Wallet Address: {address}</Text>
          <Button title="Disconnect Wallet" onPress={handleWalletDisconnect} />
        </>
      ) : (
        <Text style={{ color: 'white', fontSize: 16 }}>Wallet Not Connected</Text>
      )}
      {redirect && <Redirect href="/SignIn" />}
    </View>
  );
};



export default Profile;
