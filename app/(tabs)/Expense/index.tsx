import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useReadContract } from 'wagmi';
import { splitFactoryABI, contractAddress } from '@/function/splitFactroryExports';

export default function App() {
  const [redirect, setRedirect] = useState(false);

  const { data, error, isLoading, refetch } = useReadContract({
    abi: splitFactoryABI,
    address: contractAddress,
    functionName: 'getDeployedSplits',
  });

  const getContracts = () => {
    refetch();
    console.log(data);
  };

  const contractData = data as string[] | undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Splits</Text>

      {/* <TouchableOpacity onPress={getContracts} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Get Contracts</Text>
      </TouchableOpacity> */}

      {isLoading && <Text style={styles.loadingText}>Loading contracts...</Text>}
      {error && <Text style={styles.errorText}>Error loading contracts: {error.message}</Text>}

      {contractData && Array.isArray(contractData) && (
        <ScrollView style={styles.scrollView}>
          {contractData.map((contract, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contractButton}
              onPress={() => console.log(`Contract Address: ${contract}`)}
            >
              <Text style={styles.contractButtonText}>{contract}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setRedirect(true)}>
        <Text style={styles.buttonText}>Add Split</Text>
      </TouchableOpacity>

      {redirect && <Redirect href="/CreateSplit" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 3,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 16,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contractButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  contractButtonText: {
    color: '#f5f5f7',
    fontSize: 13,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#4a4a4a',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18, 
    fontWeight: 'bold',
  },
});
