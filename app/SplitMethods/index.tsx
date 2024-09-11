import splitABI from '@/function/splitExports';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useReadContracts, useAccount } from 'wagmi';

export default function SplitDetails() {
  const { splitAddress } = useLocalSearchParams();
  const { address: userAddress, isConnected } = useAccount(); // Wallet address of the connected user
  const [isCreator, setIsCreator] = useState(false); // Track if the user is the creator

  // Ensure splitAddress is valid
  const isValidAddress = typeof splitAddress === 'string' && splitAddress.startsWith('0x');

  if (!isValidAddress) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid contract address provided.</Text>
      </View>
    );
  }

  const splitContract = {
    address: splitAddress as `0x${string}`,
    abi: splitABI,
  } as const;

  // Fetch contract values using useReadContracts
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      { ...splitContract, functionName: 'description' },
      { ...splitContract, functionName: 'creator' },
      { ...splitContract, functionName: 'amount' },
      { ...splitContract, functionName: 'payeeCount' },
      { ...splitContract, functionName: 'status' },
      { ...splitContract, functionName: 'payReady' },
      { ...splitContract, functionName: 'notes' },
      { ...splitContract, functionName: 'mediaSource' },
      { ...splitContract, functionName: 'dates' },
    ],
  });

  // Determine if the user is the creator
  useEffect(() => {
    if (data?.[1]?.result && userAddress) {
      setIsCreator(data[1].result.toLowerCase() === userAddress.toLowerCase());
    }
  }, [data, userAddress]);

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Loading Split Data...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading contract data: {error.message}</Text>
      </View>
    );
  }

  // Helper function to truncate Ethereum addresses
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;  // First 6 and last 4 characters
  };

  // Share Split Details
  const shareSplitDetails = () => {
    const splitDetails = `
      Split Title: ${data?.[0]?.result || 'No Title'}
      Creator: ${truncateAddress(data?.[1]?.result || 'Unknown')}
      Amount: ${data?.[2]?.result ? `${data[2].result.toString()} wei` : 'N/A'}
      Participants: ${data?.[3]?.result || 'N/A'}
      Status: ${data?.[4]?.result ? 'Active' : 'Inactive'}
      Ready for Payment: ${data?.[5]?.result ? 'Yes' : 'No'}
      Notes: ${data?.[6]?.result || 'None'}
      Date: ${data?.[8]?.result || 'N/A'}
    `;

    Share.share({
      message: splitDetails,
    });
  };

  return (
    <View style={styles.container}>
      {/* Title Row */}
      <View style={styles.fullRow}>
        <Text style={styles.title}>{data?.[0]?.result || 'No Title Provided'}</Text>
      </View>

      {/* 4 x 2 Grid */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Creator</Text>
          <Text style={styles.infoText}>{data?.[1]?.result ? truncateAddress(data[1].result.toString()) : 'Unknown'}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={styles.infoText}>
            {data?.[2]?.result ? `${data[2].result.toString()} wei` : 'N/A'}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Participants</Text>
          <Text style={styles.infoText}>
            {data?.[3]?.result ? data[3].result.toString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoText}>{data?.[4]?.result ? 'Active' : 'Inactive'}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Ready for Payment</Text>
          <Text style={styles.infoText}>{data?.[5]?.result ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Notes</Text>
          <Text style={styles.infoText}>{data?.[6]?.result || 'None'}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Media</Text>
          <Text style={styles.infoText}>{data?.[7]?.result || 'None'}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoText}>{data?.[8]?.result || 'N/A'}</Text>
        </View>
      </View>

      {/* Conditionally render buttons */}
      {isConnected && (
        <View style={styles.buttonContainer}>
          {isCreator ? (
            <>
              {/* Creator-only buttons */}
              <TouchableOpacity style={styles.buttonSmall} onPress={() => console.log('Enable Payment')}>
                <Text style={styles.buttonText}>Enable Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSmall} onPress={() => console.log('Close Split')}>
                <Text style={styles.buttonText}>Close Split</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Non-creator buttons */}
              <TouchableOpacity style={styles.buttonSmall} onPress={() => console.log('Join Split')}>
                <Text style={styles.buttonText}>Join Split</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSmall} onPress={() => console.log('Pay Share')}>
                <Text style={styles.buttonText}>Pay Share</Text>
              </TouchableOpacity>
            </>
          )}
          {/* Share button */}
          <TouchableOpacity style={styles.shareButton} onPress={shareSplitDetails}>
            <Text style={styles.shareButtonText}>Share Split Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  fullRow: {
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gridItem: {
    width: '50%', // Each item takes up 50% of the width (2 items per row)
    padding: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
  },
  infoText: {
    fontSize: 16, // Smaller font size to accommodate long text
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#ff5252',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonSmall: {
    backgroundColor: '#00ff00',
    paddingVertical: 10, // Smaller padding for a more compact button
    paddingHorizontal: 15, // Slightly smaller width for a better fit
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    color: '#121212',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
