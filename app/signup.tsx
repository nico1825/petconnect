import React, { useState, useEffect, } from 'react';
import {
  View, Text, TextInput, Button, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import api from './services/api';
import { saveToken } from './utils/token';
import { Picker } from '@react-native-picker/picker';
import ScrollView = Animated.ScrollView;
import * as SecureStore from 'expo-secure-store';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PetOwner');
  const [shelterId, setShelterId] = useState('');
  const [location, setLocation] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        router.replace('/(tabs)/home-screen');
      }
    };
    checkAuth();
  }, []);

  const handleSignup = async () => {
    try {
      const userData = {
        name,
        email,
        password,
        role,
        location,


      };

      if (role === 'ShelterStaff') {
        userData.shelterId = shelterId;
      }
      console.log('📦 Sending user data:', userData);
      const res = await api.post('/auth/signup', userData);
      const { token, user } = res.data;
      console.log('🧪 token:', token, typeof token);
      console.log('🧪 user:', user, typeof user);
      console.log('🧪 user._id:', user?._id, typeof user?._id);
      console.log('🧪 user.role:', user?.role, typeof user?.role);

      await saveToken(token);
      await SecureStore.setItemAsync('userId', String(user._id));
      await SecureStore.setItemAsync('userRole', String(user.role));
      if (token && typeof token === 'string') {
        await SecureStore.setItemAsync('userToken', token);
      }

      Alert.alert('Signup successful!');
      router.replace('/(tabs)/home-screen');

    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      Alert.alert('Signup failed', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardWrapper}
      >
        <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up 🐾</Text>

          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={styles.label}>Role</Text>
          <Picker selectedValue={role} onValueChange={setRole} style={styles.input}>
            <Picker.Item label="Pet Owner" value="PetOwner" />
            <Picker.Item label="Shelter Staff" value="ShelterStaff" />
          </Picker>

          {role === 'ShelterStaff' && (
            <TextInput
              style={styles.input}
              placeholder="Shelter ID"
              value={shelterId}
              onChangeText={setShelterId}
            />
          )}

          <Text style={styles.label}>Location (Optional)</Text>
          <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />

          <Button title="Create Account" onPress={handleSignup} />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  keyboardWrapper: { flex: 1, justifyContent: 'center' },
  container: { paddingHorizontal: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 30 },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 16, paddingVertical: 8 },
  label: { fontSize: 16, fontWeight: '500', marginTop: 10 },
});
