import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useAccount, useWriteContract, WagmiProvider } from 'wagmi';
import { ethers } from 'ethers';
import { useLocalSearchParams } from 'expo-router';
import wagmiConfig from '@/function/walletExports';
import { splitFactoryABI, contractAddress } from '@/function/splitFactroryExports';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const CreateSplit = () => {
  const { expenseData } = useLocalSearchParams();
  const { address, isConnected } = useAccount();
  const [parsedExpenseData, setParsedExpenseData] = useState(null);

  useEffect(() => {
    if (expenseData) {
      const parsed = JSON.parse(String(expenseData));
      setParsedExpenseData(parsed);
    }
  }, [expenseData]);

  // // Use the `useWriteContract` hook
  // const { writeContract, data, error, isSuccess } = useWriteContract({
  //   address: contractAddress,
  //   abi: splitFactoryABI,
  //   functionName: 'createSplit',
  //   args: parsedExpenseData
  //     ? [
  //         ethers.utils.parseUnits(parsedExpenseData.amount, 'ether'),  // Amount in Wei
  //         parsedExpenseData.description,  // Description
  //         parsedExpenseData.notes,        // Notes
  //         parsedExpenseData.date,         // Date
  //         parsedExpenseData.mediaSource || '' // Media source
  //       ]
  //     : [], // No args if data is not yet parsed
  //   onSuccess: (data) => {
  //     Alert.alert('Success', 'Split created successfully!');
  //   },
  //   onError: (error) => {
  //     Alert.alert('Error', 'Failed to create the split. ' + error.message);
  //   },
  // });

  // Handle the split creation process
  // const handleCreateSplit = async () => {
  //   if (!isConnected) {
  //     Alert.alert('Error', 'Please connect your wallet.');
  //     return;
  //   }

  //   if (!parsedExpenseData) {
  //     Alert.alert('Error', 'No expense data available.');
  //     return;
  //   }

  //   try {
  //     useWriteContract({ 
  //       splitFactoryABI,
  //       contractAddress,
  //       functionName: 'createSplit',
  //       args: parsedExpenseData
  //       ? [
  //           ethers.utils.parseUnits(parsedExpenseData.amount, 'ether'), 
  //           parsedExpenseData.description,  
  //           parsedExpenseData.notes,        
  //           parsedExpenseData.date,        
  //           parsedExpenseData.mediaSource || ''
  //         ]
  //       : [],

  //       onSuccess: (data: any) => {
  //         Alert.alert('Success', 'Split created successfully!');
  //       },
  //    })
  //   } catch (error) {
  //     console.error('Error calling writeContract:', error);
  //     Alert.alert('Error', 'Failed to send the transaction.');
  //   }
  // };

  const ConfirmationView = () => {
    return (
      <View style={styles.container}>
      <Text style={styles.header}>Create a New Split</Text>
      {parsedExpenseData ? (
        <>
          <Text style={styles.label}>Payees: {parsedExpenseData.payees.map(p => p.name).join(', ')}</Text>
          <Text style={styles.label}>Description: {parsedExpenseData.description}</Text>
          <Text style={styles.label}>Amount: {parsedExpenseData.amount} ETH</Text>
          <Text style={styles.label}>Date: {parsedExpenseData.date}</Text>
          <Text style={styles.label}>Notes: {parsedExpenseData.notes}</Text>
          <Button
            title={'Create Split'}
            // onPress={handleCreateSplit}
          />
        </>
      ) : (
        <Text style={styles.label}>Loading expense data...</Text>
      )}

    </View>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConfirmationView/>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: 'lightgrey',
    marginBottom: 10,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default CreateSplit;
