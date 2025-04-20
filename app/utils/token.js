import * as SecureStore from 'expo-secure-store';

export async function saveToken(token) {
  if (typeof token === 'string') {
    await SecureStore.setItemAsync('userToken', token);
  } else {
    console.warn('🚫 Tried to save invalid token:', token);
  }
}


export async function getToken() {
  return await SecureStore.getItemAsync('userToken');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('userToken');
}
