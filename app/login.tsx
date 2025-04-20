// login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import api from './services/api';
import { saveToken } from './utils/token';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        router.replace('/(tabs)/home-screen');
      }
    };
    checkAuth();
  },[]);

  const handleLogin = async () => {
    try {
      // 1. Hit your login endpoint
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      console.log('🚀 Login response:', res.data);

      // 2. Make sure you actually got a token + user back
      if (typeof token !== 'string' || !user?._id) {
        throw new Error('Invalid login response');
      }

      // 3. Store them (all strings only!)
      await saveToken(token);
      await SecureStore.setItemAsync('userId',    String(user._id));
      await SecureStore.setItemAsync('userRole',  String(user.role));
      await SecureStore.setItemAsync('userName',  String(user.name));
      await SecureStore.setItemAsync('userEmail', String(user.email));

      // 4. Feedback + navigate into your tabs
      Alert.alert('Login successful!', `Welcome back, ${user.name}!`);
      router.replace('/(tabs)/home-screen');

    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert(
        'Login failed',
        err.response?.data?.message || err.message || 'Something went wrong'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Login to PetConnect 🐾</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input:     { borderBottomWidth: 1, marginBottom: 15, fontSize: 16, padding: 8 }
});
