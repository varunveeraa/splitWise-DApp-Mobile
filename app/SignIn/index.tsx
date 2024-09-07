import React, { useState, useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { useAccount } from 'wagmi';
import { Web3Modal, W3mButton } from '@web3modal/wagmi-react-native';
import { View } from 'react-native';
import { Redirect } from 'expo-router';

const ConnectWallet = () => {
  const { address, isConnected } = useAccount(); 
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (isConnected) {
      console.log("Wallet connected:", address); 
      setRedirect(true);  
    }
  }, [isConnected]);

  if (redirect) {
    return <Redirect href="/Expense" />;
  }

  return (
    <View>
      <Web3Modal />
      <W3mButton balance="show" label="Connect Wallet" />
    </View>
  );
};

export default ConnectWallet;
