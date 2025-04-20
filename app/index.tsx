import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Link } from 'expo-router';



export default function HomeScreen() {

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        router.replace('/(tabs)/home-screen'); // 🚀 Authenticated? Go straight in
      } else {
        setCheckingAuth(false);   // No token? Show the login/signup buttons
      }
    };
    checkToken();
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Checking credentials...</Text>
      </View>
    );
  }

  return (
  <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Text style={styles.titleContainer}>Welcome to PetConnect 🐾</Text>
      <Link href="/login" asChild>
        <Button title="Login" />
      </Link>
      <Link href="/signup" asChild>
        <Button title="Sign Up" />
      </Link>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  titleContainer: {
    fontSize: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
