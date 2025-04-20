import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView, Animated} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import {router} from "expo-router";
import {Collapsible} from "@/components/Collapsible";
import { TouchableOpacity } from 'react-native';
import ScrollView = Animated.ScrollView;
import { useFocusEffect } from '@react-navigation/native';


export default function UserProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState([]);
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);


  useFocusEffect(
  React.useCallback(() => {

    const fetchUser = async () => {
    const id = await SecureStore.getItemAsync('userId');
    const name = await SecureStore.getItemAsync('userName');
    const email = await SecureStore.getItemAsync('userEmail');
    const role = await SecureStore.getItemAsync('userRole');
    const location = await SecureStore.getItemAsync('userLocation');

    console.log('📍 Retrieved location from SecureStore:', location); // optional debug

    if (id) {
      setUser({ id, name, email, role, location });
    }
    setLoadingUser(false);
  };

  fetchUser();
    const fetchPets = async () => {
      try {
        console.log('🧠 Profile screen mounted or focused');

        const token = await SecureStore.getItemAsync('userToken');
        const userId = await SecureStore.getItemAsync('userId');
        if (!token || !userId) return;

        console.log('🔁 Fetching pets for profile...');

        const res = await api.get(`/pets/owner/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('🐶 Pets fetched:', res.data);


        setPets(res.data);
      } catch (err) {
       console.error('🐾 Failed to load pets:', err.response?.data || err.message || err);;
      }
    };

    fetchPets();
  }, [])
);
  if (loadingUser) {
  return <Text style={{ padding: 20 }}>Loading profile...</Text>;
  }

  const togglePet = (id: string) => {
  setActivePetId(prev => (prev === id ? null : id));
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userId');
  };

  return (

    <SafeAreaView style={styles.safe}>
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>👤 Your Profile</Text>
      <Text style={styles.label}>Name: {user.name}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>

      <Text style={styles.label}>Location: {user.location}</Text>


      <Text style={styles.title}>Your Pets</Text>

    {pets.length === 0 ? (
      <Text>You don't have any pets yet.</Text>
    ) : (
      pets.map((pet) => (
        <View key={pet._id} style={styles.petCard}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text>Breed: {pet.breed}</Text>
          <Text>Age: {pet.age}</Text>
          <Text>Status: {pet.status}</Text>
        </View>
      ))
    )}

      <Button title="Add Pet" onPress={() => router.push('/screens/pet-create')} />
      <Button title="Go to Home" onPress={() => router.push('/home-screen')} />
      <Button title="Logout" onPress={async () => {await logout();router.replace('/');}}/>
    </View>
    </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 18, marginBottom: 10 },
  sectionTitle: {
  fontSize: 20,
  marginTop: 30,
  marginBottom: 10,
  fontWeight: '600',
},
petCard: {
  padding: 15,
  backgroundColor: '#f2f2f2',
  borderRadius: 8,
  marginBottom: 10,
},
petName: {
  fontWeight: 'bold',
  fontSize: 18,
  marginBottom: 5,
},

});
