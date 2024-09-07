import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useReadContract, useReadContracts } from 'wagmi';
import { splitFactoryABI, contractAddress } from '@/function/splitFactroryExports';
import splitABI from '@/function/splitExports';

export default function App() {
  const [redirect, setRedirect] = useState(false);

  // Fetch deployed contracts with type annotation
  const { data: contractData, error: contractError, isLoading: isContractsLoading } = useReadContract<string[]>({
    abi: splitFactoryABI,
    address: contractAddress,
    functionName: 'getDeployedSplits',
  });

  // Ensure contractData is typed as an array of strings or undefined
  const descriptionContracts = contractData?.map((contract: string) => ({
    address: contract,
    abi: splitABI,
    functionName: 'description',
  })) || [];

  const amountContracts = contractData?.map((contract: string) => ({
    address: contract,
    abi: splitABI,
    functionName: 'amount',
  })) || [];

  // Use `useReadContracts` to read descriptions and amounts for all contracts
  const { data: descriptions, error: descriptionsError, isLoading: isDescriptionsLoading } = useReadContracts({
    contracts: descriptionContracts,
  });

  const { data: amounts, error: amountsError, isLoading: isAmountsLoading } = useReadContracts({
    contracts: amountContracts,
  });

  console.log(descriptions, amounts);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Splits</Text>

      {isContractsLoading && <Text style={styles.loadingText}>Loading contracts...</Text>}
      {contractError && <Text style={styles.errorText}>Error loading contracts: {contractError.message}</Text>}
      {isDescriptionsLoading && !isContractsLoading && <Text style={styles.loadingText}>Loading descriptions...</Text>}
      {descriptionsError && <Text style={styles.errorText}>Error loading descriptions: {descriptionsError.message}</Text>}
      {isAmountsLoading && !isContractsLoading && <Text style={styles.loadingText}>Loading amounts...</Text>}
      {amountsError && <Text style={styles.errorText}>Error loading amounts: {amountsError.message}</Text>}

      {/* Render contract addresses, descriptions, and amounts */}
      {contractData && contractData.length > 0 && (
        <ScrollView style={styles.scrollView}>
          {contractData.map((contract: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.contractButton}
              onPress={() => console.log(`Contract Address: ${contract}`)}
            >
              {/* Display the contract address */}
              <Text style={styles.contractButtonText}>{contract}</Text>

              {/* Display description and amount on the same line but at opposite ends */}
              <View style={styles.row}>
                <Text style={styles.descriptionText}>
                  {descriptions?.[index]?.result
                    ? descriptions[index].result.toString()
                    : 'Loading description...'}
                </Text>
                <Text style={styles.amountText}>
                  {amounts?.[index]?.result
                    ? `${amounts[index].result.toString()} wei`
                    : 'Loading amount...'}
                </Text>
              </View>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  contractButtonText: {
    fontSize: 12, // Smaller font size
    color: 'rgba(255, 255, 255, 0.5)', // High transparency
    fontWeight: '400',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out description and amount
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 18, // Larger font size for emphasis
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  amountText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: 'bold',
    marginTop: 5,
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
    borderWidth: 2, // Add a solid border
    borderColor: '#00ff00', // Green border
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});