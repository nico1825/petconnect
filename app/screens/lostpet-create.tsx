import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function CreateLostPetPost() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photo, setPhoto] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchPetsAndUser = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      const token = await SecureStore.getItemAsync('userToken');
      const email = await SecureStore.getItemAsync('userEmail');

      setContactEmail(email);

      const res = await api.get(`/pets/owner/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPets(res.data);
    };

    fetchPetsAndUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
  if (!selectedPetId || !lastSeenLocation) {
    Alert.alert('Please select a pet and enter last seen location.');
    return;
  }

  try {
    const token = await SecureStore.getItemAsync('userToken');
    console.log('🔐 Lost post token:', token);
    await api.post(
      '/lostpets',
      {
        petId: selectedPetId,
        lastSeenLocation: lastSeenLocation,
        contactInfo: {
          phone: contactPhone,
          email: contactEmail,
        },
        photoUrl: photo?.uri || ''  // **make sure this key is here**
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Alert.alert('Lost post submitted!');
    router.replace('/home-screen');

  } catch (err) {
    console.error('Lost post failed:', err.response?.data || err.message);
    Alert.alert('Error', err.response?.data?.error || err.message);
  }
};


  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report Lost Pet</Text>

      <Text style={styles.label}>Select Your Pet:</Text>
      {pets.map((pet) => (
        <TouchableOpacity
          key={pet._id}
          onPress={() => setSelectedPetId(pet._id)}
          style={[styles.petOption, selectedPetId === pet._id && styles.petSelected]}
        >
          <Text>{pet.name} ({pet.breed})</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Last Seen Location:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Biscayne Blvd, Miami, FL"
        value={lastSeenLocation}
        onChangeText={setLastSeenLocation}
      />

      <Text style={styles.label}>Contact Phone (optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="305-555-1234"
        value={contactPhone}
        onChangeText={setContactPhone}
      />

      <Text style={styles.label}>Upload a Photo:</Text>
      {photo && <Image source={{ uri: photo.uri }} style={styles.photo} />}
      <Button title="Pick an Image" onPress={pickImage} />

      <Button title="Submit Lost Pet Post" onPress={handleSubmit} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 16, fontWeight: '600' },
  input: { borderBottomWidth: 1, padding: 8, marginBottom: 12 },
  petOption: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
    borderRadius: 6,
  },
  petSelected: {
    backgroundColor: '#d0f0d0',
  },
  photo: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8
  }
});

