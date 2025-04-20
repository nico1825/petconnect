import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet, SafeAreaView, Image, Button, TextInput
} from 'react-native';
import api from '../services/api';

export default function HomeScreen() {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({location: '', breed: '', date: ''});


  const fetchLost = async (useFilters = false) => {
      try {
        let res;
        if (useFilters) {
          const query = new URLSearchParams(filters).toString();
          res = await api.get(`/lostpets/search?${query}`);
        } else {
          res = await api.get('/lostpets');
        }
        setLostPets(res.data);
      } catch (err: any) {
        console.error('Error fetching lost pets:', err.response?.data || err.message);
      }
    };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await fetchLost(); // ← works now
      if (mounted) setLoading(false);
    };

    const fetchAdoptions = async () => {
      try {
        const res = await api.get('/adoptions');
        if (mounted) setAdoptions(res.data);
      } catch (err: any) {
        console.error('Error fetching adoptions:', err.response?.data || err.message);
      }
    };

    load();
    return () => {
      mounted = false
    };

  }, []);




  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
    <Button title="Apply Filters" onPress={() => fetchLost(true)} />
    <View style={{ paddingHorizontal: 16 }}>
      <TextInput
        placeholder="Location"
        value={filters.location}
        onChangeText={text => setFilters(prev => ({ ...prev, location: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Breed"
        value={filters.breed}
        onChangeText={text => setFilters(prev => ({ ...prev, breed: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={filters.date}
        onChangeText={text => setFilters(prev => ({ ...prev, date: text }))}
        style={styles.input}
      />
    </View>
    <FlatList
      ListHeaderComponent={<Text style={styles.header}>Lost Pets</Text>}
      data={lostPets}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}> Status: {item.status}</Text>
          <Text style={styles.title}> {item.pet?.name || 'Unnamed Pet'}</Text>
          <Text>Last seen at: {item.lastSeenLocation}</Text>

          <Text>Reported: { new Date(item.reportedAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}</Text>
          <Text>Phone Number: {item.contactInfo.phone}</Text>
          <Text>Email: {item.contactInfo.email}</Text>
          {item.photoUrl ? (
          <Image
            source={{ uri: item.photoUrl }}
            style={styles.image}
            onError={() => console.log('❌ Failed to load image for', item.pet?.name)}
          />
          ) : (
            <Text style={styles.title}>{"NO IMAGE"}</Text>
          )}
        </View>
      )}
      ListFooterComponent={
        <>
          <Text style={styles.header}>Adoption Listings</Text>
          {adoptions.length === 0 && <Text style={styles.empty}>No listings yet.</Text>}
          {adoptions.map(listing => (
            <View key={listing._id} style={styles.card}>
              <Text style={styles.title}>Name: {listing.pet?.name || 'Unnamed Pet'}</Text>
              <Text>Contact: {listing.contactInfo?.email || listing.contactInfo?.phone}</Text>
            </View>
          ))}
        </>
      }
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {width: '100%', height: 180, borderRadius: 10, marginTop: 10, resizeMode: 'cover'},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', margin: 16 },
  empty: { textAlign: 'center', color: '#666', marginBottom: 16 },
  card: {backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 8, elevation: 2},
  title: { fontSize: 18, fontWeight: '600' }
});
