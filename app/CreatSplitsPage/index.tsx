import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useWriteContract } from "wagmi";
import { splitFactoryABI, contractAddress } from '@/function/splitFactroryExports';

const CreateSplit = () => {
  const { expenseData } = useLocalSearchParams(); 
  const [parsedExpenseData, setParsedExpenseData] = useState<string[] | null>(null);
  const { writeContract } = useWriteContract();
  const abi = splitFactoryABI;

  useEffect(() => {
    if (expenseData) {
      try {
        const parsedData = JSON.parse(expenseData as string);  
        
        if (Array.isArray(parsedData)) {
          setParsedExpenseData(parsedData); 
        } else if (typeof parsedData === 'object') {
          const arrayData = [
            parsedData.amount,
            parsedData.description,
            parsedData.notes,
            parsedData.date,
            parsedData.mediaSource
          ];
          setParsedExpenseData(arrayData); 
        } else {
          console.error("Parsed data is neither an array nor an object.");
        }
      } catch (error) {
        console.error("Error parsing expenseData:", error);
      }
    }
  }, [expenseData]);

  const handleCreateSplit = async () => {
    if (parsedExpenseData) {
      const result = await writeContract({
        abi,
        address: contractAddress,
        functionName: 'createSplit',
        args: parsedExpenseData,
      });

      console.log(result);
    } else {
      console.error("Parsed expense data is null or invalid.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Split</Text>
      {parsedExpenseData ? (
        <>
          <Text style={styles.label}>Amount: {parsedExpenseData[0]} ETH</Text>
          <Text style={styles.label}>Description: {parsedExpenseData[1]}</Text>
          <Text style={styles.label}>Notes: {parsedExpenseData[2]}</Text>
          <Text style={styles.label}>Date: {parsedExpenseData[3]}</Text>
          <Text style={styles.label}>Media Source: {parsedExpenseData[4]}</Text>
          <Button title={'Create Split'} onPress={handleCreateSplit} />
        </>
      ) : (
        <Text style={styles.label}>Loading expense data...</Text>
      )}
    </View>
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
});

export default CreateSplit;
