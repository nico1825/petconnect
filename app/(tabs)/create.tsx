import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, TextInput, StyleSheet, Image, Alert, TouchableOpacity, SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";

export default function CreatePostScreen() {
  const [mode, setMode] = useState<'regular' | 'lost'>('regular');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      const token = await SecureStore.getItemAsync('userToken');
      if (!userId || !token) return;

      const res = await api.get(`/pets/owner/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPets(res.data);
    };

    if (mode === 'lost') {
      fetchPets();
    }
  }, [mode]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const submitPost = async () => {
    const token = await SecureStore.getItemAsync('userToken');

    if (!image) return Alert.alert('Please add a photo.');

    if (mode === 'regular') {
      // Just post photo + text (to a future /posts endpoint)
      Alert.alert('Posted (not implemented yet)');
    } else {
      // Report lost pet
      try {
        await api.post('/lostpets', {
          petId: selectedPetId,
          lastSeenLocation: lastSeen,
          // Optionally: image, contactInfo, etc.
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Alert.alert('Lost pet report submitted!');
      } catch (err) {
        console.error(err);
        Alert.alert('Failed to report lost pet');
      }
    }
  };

  const logout = async () => {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('userId');
};

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.title}>Create a Post</Text>

      <View style={styles.switchRow}>
        <TouchableOpacity onPress={() => setMode('regular')}>
          <Text style={[styles.option, mode === 'regular' && styles.activeOption]}>Regular Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/lostpet-create')}>
          <Text style={[styles.option, mode === 'lost' && styles.activeOption]}>Lost Pet Report</Text>
        </TouchableOpacity>
      </View>

      {mode === 'regular' && (
        <>
          <TextInput
            placeholder="What's on your mind?"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
        </>
      )}

      {mode === 'lost' && (
        <>
          <Text style={styles.label}>Select Pet:</Text>
          {pets.map((pet) => (
            <TouchableOpacity key={pet._id} onPress={() => setSelectedPetId(pet._id)}>
              <Text style={[styles.petOption, selectedPetId === pet._id && styles.selectedPet]}>
                {pet.name} ({pet.species})
              </Text>
            </TouchableOpacity>
          ))}

          <TextInput
            placeholder="Last seen location (address or GPS)"
            value={lastSeen}
            onChangeText={setLastSeen}
            style={styles.input}
          />
        </>
      )}

      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Pick an Image" onPress={pickImage} />
      <Button title="Submit Post" onPress={submitPost} />
      <Button title="Logout" onPress={async () => {await logout();router.replace('/');}}/>


    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  option: { fontSize: 16, padding: 10, borderRadius: 8, backgroundColor: '#eee' },
  activeOption: { backgroundColor: '#cce5ff' },
  label: { fontSize: 16, fontWeight: '500', marginTop: 16 },
  petOption: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  selectedPet: { backgroundColor: '#dff0d8' },
  input: { borderBottomWidth: 1, marginBottom: 15, fontSize: 16, padding: 8 },
  image: { width: '100%', height: 200, marginTop: 15, marginBottom: 15 },
});
