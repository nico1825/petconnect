// app/(tabs)/adoption-create.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function AdoptionCreate() {
  const router = useRouter();
  const [petId, setPetId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = async () => {
    const token = await SecureStore.getItemAsync('userToken');

    try {
      await api.post('/adoptions', {
        petId,
        contactInfo: {
          phone,
          email
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Adoption listing created!');
      router.push('/user-profile');
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to create listing', err.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Adoption Listing</Text>
      <TextInput style={styles.input} placeholder="Pet ID" onChangeText={setPetId} />
      <TextInput style={styles.input} placeholder="Contact Phone" onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Contact Email" onChangeText={setEmail} />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, fontSize: 16 },
});
