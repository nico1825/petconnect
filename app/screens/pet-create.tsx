import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, SafeAreaView
} from 'react-native';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';


export default function CreatePetScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [status, setStatus] = useState('available');

  const handleCreatePet = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      console.log('🔐 Sending token:', token);

      const res = await api.post('/pets', {
        name,
        age,
        breed,
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Pet profile created!');
      router.back();

    } catch (err) {
      console.error('Create pet error:', err);
      Alert.alert('Failed to create pet', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a Pet Profile 🐶</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Breed (optional)" value={breed} onChangeText={setBreed} />
      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(value) => setStatus(value)}
        style={styles.picker}
      >
        <Picker.Item label="Available" value="available" />
        <Picker.Item label="Adopted" value="adopted" />
        <Picker.Item label="Lost" value="lost" />
        <Picker.Item label="found" value="found" />
      </Picker>
      <Button title="Create Pet" onPress={handleCreatePet} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 6,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 16, paddingVertical: 8 }
});
