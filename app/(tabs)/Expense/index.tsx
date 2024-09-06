import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function App() {
  const [redirect, setRedirect] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hello, Welcome to Decentralized World</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setRedirect(true)}>
        <Text style={styles.buttonText}>Add Expense</Text>
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
    backgroundColor: '#1c1c1e', 
  },
  welcomeText: {
    fontSize: 24,
    color: '#f5f5f7', 
    textAlign: 'center',
    margin: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#444',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    elevation: 5,
  },
  buttonText: {
    color: '#f5f5f7',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
